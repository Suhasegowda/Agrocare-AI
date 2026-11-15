import re

from sklearn.feature_extraction.text import TfidfVectorizer

from app.knowledge import all_passages
from ml.labels import SOURCE_TITLE, SOURCE_URL

DOSAGE_PATTERNS = [
    r"\bdosage\b",
    r"\bdose\b",
    r"\bdoses\b",
    r"how much",
    r"how many",
    r"how often",
    r"\bml\b",
    r"millilit",
    r"\bgrams?\b",
    r"g/l",
    r"ml/l",
    r"per lit",
    r"\btank\b",
    r"\bmix(?:ing)?\b",
    r"tank-mix",
    r"substitut",
    r"what should i spray",
    r"which pesticide",
    r"which fungicide",
    r"what pesticide",
    r"what fungicide",
    r"what chemical",
    r"spray frequency",
    r"how many weeks",
    r"pre-harvest",
]

REFUSAL = (
    "This question is not verified for a pesticide dose, mixing instruction, spray frequency, "
    "or product substitution. Check the current product label and the ICAR–NRIIPM technical bulletins."
)


class AdvisoryIndex:
    def __init__(self, passages: list[dict]):
        self.passages = passages
        corpus = [item["text"] for item in passages]
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.matrix = self.vectorizer.fit_transform(corpus)

    def answer(self, query: str, crop_id: str | None = None, disease: str | None = None) -> dict:
        if is_dosage_query(query):
            return {
                "notVerified": True,
                "text": REFUSAL,
                "citations": [SOURCE_TITLE],
                "sourceUrl": SOURCE_URL,
                "disease": disease,
            }
        if not query.strip():
            return _missing("Ask a question about symptoms, sanitation, or scouting.")

        scores = self.vectorizer.transform([query])
        ranked = (self.matrix @ scores.T).toarray().ravel()
        query_lower = query.lower()
        best_index = 0
        best_score = -1.0
        for index, passage in enumerate(self.passages):
            score = float(ranked[index])
            if crop_id and passage["cropId"] == crop_id:
                score += 0.08
            if disease and passage["disease"].lower() == disease.lower():
                score += 0.12
            if disease and disease.lower() in query_lower and passage["disease"].lower() == disease.lower():
                score += 0.05
            if score > best_score:
                best_score = score
                best_index = index
        if best_score < 0.12:
            return _missing("No verified passage in the local library matches this question. Nothing has been invented.")

        passage = self.passages[best_index]
        lines = passage["culturalControl"] + [
            "Biological products must match the current label for this crop. No rate is given here."
        ]
        return {
            "notVerified": False,
            "text": " ".join(lines),
            "citations": [passage["sourceTitle"]],
            "sourceUrl": passage["sourceUrl"],
            "disease": passage["disease"],
            "crop": passage["crop"],
            "culturalControl": passage["culturalControl"],
            "biologicalControl": passage["biologicalControl"],
        }


def is_dosage_query(query: str) -> bool:
    text = query.lower()
    return any(re.search(pattern, text) for pattern in DOSAGE_PATTERNS)


def _missing(message: str) -> dict:
    return {
        "notVerified": True,
        "text": message,
        "citations": [SOURCE_TITLE],
        "sourceUrl": SOURCE_URL,
        "disease": None,
    }


_index: AdvisoryIndex | None = None


def get_index() -> AdvisoryIndex:
    global _index
    if _index is None:
        _index = AdvisoryIndex(all_passages())
    return _index
