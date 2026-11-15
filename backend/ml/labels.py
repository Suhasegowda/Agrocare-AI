"""PlantVillage class list used by training and inference.

Folder names match the public PlantVillage color split so a local copy of
that dataset can be trained without renaming. Pepper maps to the frontend
crop id `chilli`.
"""

CLASSES = [
    {"folder": "Apple___Apple_scab", "cropId": "apple", "crop": "Apple", "disease": "Apple Scab", "pathogen": "Fungus (Venturia inaequalis)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Apple___Black_rot", "cropId": "apple", "crop": "Apple", "disease": "Apple Black Rot", "pathogen": "Fungus (Botryosphaeria obtusa)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Apple___Cedar_apple_rust", "cropId": "apple", "crop": "Apple", "disease": "Cedar Apple Rust", "pathogen": "Fungus (Gymnosporangium juniperi-virginianae)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Apple___healthy", "cropId": "apple", "crop": "Apple", "disease": "Apple Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Blueberry___healthy", "cropId": "blueberry", "crop": "Blueberry", "disease": "Blueberry Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Cherry_(including_sour)___Powdery_mildew", "cropId": "cherry", "crop": "Cherry", "disease": "Cherry Powdery Mildew", "pathogen": "Fungus (Podosphaera clandestina)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Cherry_(including_sour)___healthy", "cropId": "cherry", "crop": "Cherry", "disease": "Cherry Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "cropId": "corn", "crop": "Maize / Corn", "disease": "Corn Gray Leaf Spot", "pathogen": "Fungus (Cercospora zeae-maydis)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Corn_(maize)___Common_rust_", "cropId": "corn", "crop": "Maize / Corn", "disease": "Corn Common Rust", "pathogen": "Fungus (Puccinia sorghi)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Corn_(maize)___Northern_Leaf_Blight", "cropId": "corn", "crop": "Maize / Corn", "disease": "Corn Northern Leaf Blight", "pathogen": "Fungus (Exserohilum turcicum)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Corn_(maize)___healthy", "cropId": "corn", "crop": "Maize / Corn", "disease": "Corn Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Grape___Black_rot", "cropId": "grape", "crop": "Grape", "disease": "Grape Black Rot", "pathogen": "Fungus (Guignardia bidwellii)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Grape___Esca_(Black_Measles)", "cropId": "grape", "crop": "Grape", "disease": "Grape Esca", "pathogen": "Wood-infecting fungal complex", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "cropId": "grape", "crop": "Grape", "disease": "Grape Leaf Blight", "pathogen": "Fungus (Pseudocercospora vitis)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Grape___healthy", "cropId": "grape", "crop": "Grape", "disease": "Grape Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Orange___Haunglongbing_(Citrus_greening)", "cropId": "orange", "crop": "Orange", "disease": "Citrus Greening", "pathogen": "Bacterium (Candidatus Liberibacter)", "pathogenType": "Bacterial", "healthy": False},
    {"folder": "Peach___Bacterial_spot", "cropId": "peach", "crop": "Peach", "disease": "Peach Bacterial Spot", "pathogen": "Bacterium (Xanthomonas arboricola)", "pathogenType": "Bacterial", "healthy": False},
    {"folder": "Peach___healthy", "cropId": "peach", "crop": "Peach", "disease": "Peach Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Pepper,_bell___Bacterial_spot", "cropId": "chilli", "crop": "Chilli", "disease": "Pepper Bacterial Spot", "pathogen": "Bacterium (Xanthomonas spp.)", "pathogenType": "Bacterial", "healthy": False},
    {"folder": "Pepper,_bell___healthy", "cropId": "chilli", "crop": "Chilli", "disease": "Pepper Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Potato___Early_blight", "cropId": "potato", "crop": "Potato", "disease": "Potato Early Blight", "pathogen": "Fungus (Alternaria solani)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Potato___Late_blight", "cropId": "potato", "crop": "Potato", "disease": "Potato Late Blight", "pathogen": "Oomycete (Phytophthora infestans)", "pathogenType": "Oomycete", "healthy": False},
    {"folder": "Potato___healthy", "cropId": "potato", "crop": "Potato", "disease": "Potato Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Raspberry___healthy", "cropId": "raspberry", "crop": "Raspberry", "disease": "Raspberry Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Soybean___healthy", "cropId": "soybean", "crop": "Soybean", "disease": "Soybean Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Squash___Powdery_mildew", "cropId": "squash", "crop": "Squash", "disease": "Squash Powdery Mildew", "pathogen": "Fungus (Podosphaera xanthii)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Strawberry___Leaf_scorch", "cropId": "strawberry", "crop": "Strawberry", "disease": "Strawberry Leaf Scorch", "pathogen": "Fungus (Diplocarpon earlianum)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Strawberry___healthy", "cropId": "strawberry", "crop": "Strawberry", "disease": "Strawberry Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
    {"folder": "Tomato___Bacterial_spot", "cropId": "tomato", "crop": "Tomato", "disease": "Tomato Bacterial Spot", "pathogen": "Bacterium (Xanthomonas spp.)", "pathogenType": "Bacterial", "healthy": False},
    {"folder": "Tomato___Early_blight", "cropId": "tomato", "crop": "Tomato", "disease": "Tomato Early Blight", "pathogen": "Fungus (Alternaria solani)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Tomato___Late_blight", "cropId": "tomato", "crop": "Tomato", "disease": "Tomato Late Blight", "pathogen": "Oomycete (Phytophthora infestans)", "pathogenType": "Oomycete", "healthy": False},
    {"folder": "Tomato___Leaf_Mold", "cropId": "tomato", "crop": "Tomato", "disease": "Tomato Leaf Mold", "pathogen": "Fungus (Passalora fulva)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Tomato___Septoria_leaf_spot", "cropId": "tomato", "crop": "Tomato", "disease": "Tomato Septoria Leaf Spot", "pathogen": "Fungus (Septoria lycopersici)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Tomato___Spider_mites Two-spotted_spider_mite", "cropId": "tomato", "crop": "Tomato", "disease": "Tomato Spider Mites", "pathogen": "Arachnid (Tetranychus urticae)", "pathogenType": "Pest", "healthy": False},
    {"folder": "Tomato___Target_Spot", "cropId": "tomato", "crop": "Tomato", "disease": "Tomato Target Spot", "pathogen": "Fungus (Corynespora cassiicola)", "pathogenType": "Fungal", "healthy": False},
    {"folder": "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "cropId": "tomato", "crop": "Tomato", "disease": "Tomato Yellow Leaf Curl Virus", "pathogen": "Virus (TYLCV), whitefly vector", "pathogenType": "Viral", "healthy": False},
    {"folder": "Tomato___Tomato_mosaic_virus", "cropId": "tomato", "crop": "Tomato", "disease": "Tomato Mosaic Virus", "pathogen": "Virus (ToMV)", "pathogenType": "Viral", "healthy": False},
    {"folder": "Tomato___healthy", "cropId": "tomato", "crop": "Tomato", "disease": "Tomato Healthy", "pathogen": None, "pathogenType": None, "healthy": True},
]

ALIASES = {"pepper": "chilli", "maize": "corn"}

CROP_NAMES = {
    "tomato": "Tomato",
    "potato": "Potato",
    "corn": "Maize / Corn",
    "rice": "Rice / Paddy",
    "cotton": "Cotton",
    "chilli": "Chilli",
    "wheat": "Wheat",
    "sugarcane": "Sugarcane",
    "apple": "Apple",
    "blueberry": "Blueberry",
    "cherry": "Cherry",
    "grape": "Grape",
    "orange": "Orange",
    "peach": "Peach",
    "raspberry": "Raspberry",
    "soybean": "Soybean",
    "squash": "Squash",
    "strawberry": "Strawberry",
    "arecanut": "Arecanut",
    "coconut": "Coconut",
    "coffee": "Coffee",
    "tea": "Tea",
}

SOURCE_URL = "https://www.nriipm.res.in/technical-bulletins.aspx"
SOURCE_TITLE = "ICAR–National Research Centre for Integrated Pest Management, technical bulletins"


def normalize_crop_id(crop_id: str | None) -> str:
    value = (crop_id or "").strip().lower()
    return ALIASES.get(value, value)


def is_known_crop(crop_id: str | None) -> bool:
    return normalize_crop_id(crop_id) in CROP_NAMES


def crop_name(crop_id: str | None) -> str:
    return CROP_NAMES.get(normalize_crop_id(crop_id), crop_id or "")


def model_covers(crop_id: str | None) -> bool:
    cid = normalize_crop_id(crop_id)
    return any(item["cropId"] == cid for item in CLASSES)


def class_by_folder() -> dict[str, dict]:
    return {item["folder"]: item for item in CLASSES}
