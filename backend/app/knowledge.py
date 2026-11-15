"""Curated advisory passages.

Chemical rates are not generated. The three product lines already present in
the frontend mock are stored only as label references and are never returned
by the chatbot.
"""

from ml.labels import CLASSES, SOURCE_TITLE, SOURCE_URL

GENERIC_CULTURAL = [
    "Remove and destroy clearly infected leaves or plants. Do not compost them.",
    "Avoid overhead watering so foliage can dry.",
    "Scout again in a few days and keep the photos with this case.",
]

GENERIC_BIOLOGICAL = [
    "Use a biological product only when its current label lists this crop. This library does not set a rate.",
]

HEALTHY_CULTURAL = [
    "Keep scouting. A healthy-looking photo is not proof the crop is free of disease.",
    "A single healthy image cannot close a case.",
]

NO_CURE_NOTE = (
    "This library has no verified curative treatment for this class. "
    "Follow the local agriculture department advisory and the source bulletin."
)

OVERRIDES = {
    "Tomato Early Blight": {
        "keywords": ["early blight", "alternaria", "concentric", "target", "tomato", "prune"],
        "symptoms": [
            "Dark brown spots with concentric rings on older leaves",
            "Yellow halo around the spots",
            "Lower leaves dropping early",
        ],
        "cultural": [
            "Prune and destroy infected lower leaves. Do not compost them.",
            "Water at the soil line and avoid wetting the foliage.",
            "Leave space between plants so the canopy can dry.",
        ],
        "biological": [
            "Trichoderma and Pseudomonas products are used in tomato IPM only when the current label lists tomato.",
        ],
        "labelReference": [
            "Verify against the current official label before any use. AgroCare does not prescribe this dose. Reference line from the project library: Mancozeb 75% WP @ 2.0g/L water.",
            "Verify against the current official label before any use. AgroCare does not prescribe this dose. Reference line from the project library: Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0ml/L.",
        ],
    },
    "Tomato Late Blight": {
        "keywords": ["late blight", "phytophthora", "water soaked", "tomato"],
        "symptoms": ["Water-soaked patches that expand quickly in wet weather", "White growth on the underside of leaves in the morning"],
        "cultural": ["Stop overhead irrigation.", "Remove badly infected plants so spores are not spread through the canopy."],
    },
    "Tomato Yellow Leaf Curl Virus": {
        "keywords": ["leaf curl", "tylcv", "whitefly", "virus", "tomato"],
        "symptoms": ["Upward curling of young leaves", "Yellowing and stunted growth"],
        "cultural": ["Remove infected plants.", "Reduce whitefly resting sites around the plot.", NO_CURE_NOTE],
    },
    "Tomato Mosaic Virus": {
        "keywords": ["mosaic", "tomv", "virus", "tomato"],
        "symptoms": ["Mottled light and dark green patches on leaves"],
        "cultural": ["Do not handle tobacco and then tomato plants.", "Remove infected plants and wash hands and tools.", NO_CURE_NOTE],
    },
    "Tomato Bacterial Spot": {
        "keywords": ["bacterial spot", "xanthomonas", "tomato"],
        "symptoms": ["Small dark spots, sometimes with a yellow halo, on leaves and fruit"],
        "cultural": ["Avoid working in the crop while it is wet.", "Use clean seed and remove infected debris."],
    },
    "Tomato Leaf Mold": {
        "keywords": ["leaf mold", "passalora", "tomato", "greenhouse"],
        "symptoms": ["Yellow patches on the upper leaf and olive mold underneath"],
        "cultural": ["Increase airflow and reduce long periods of leaf wetness."],
    },
    "Tomato Septoria Leaf Spot": {
        "keywords": ["septoria", "tomato", "spot"],
        "symptoms": ["Many small round spots with dark margins on lower leaves"],
        "cultural": ["Remove lower spotted leaves and avoid wetting the foliage."],
    },
    "Tomato Spider Mites": {
        "keywords": ["spider mite", "stippling", "webbing", "tomato"],
        "symptoms": ["Fine yellow stippling and webbing on the underside of leaves"],
        "cultural": ["Reduce dust and water stress. This library does not include a miticide rate."],
    },
    "Tomato Target Spot": {
        "keywords": ["target spot", "corynespora", "tomato"],
        "symptoms": ["Spots with concentric rings that can look similar to early blight"],
        "cultural": ["Do not treat a look-alike spot as confirmed early blight without a review.", "Remove infected debris and avoid long leaf wetness."],
    },
    "Potato Early Blight": {
        "keywords": ["early blight", "alternaria", "potato"],
        "symptoms": ["Target-shaped spots on older potato leaves"],
        "cultural": ["Remove infected debris and avoid overhead irrigation."],
    },
    "Potato Late Blight": {
        "keywords": ["late blight", "phytophthora", "potato", "tuber"],
        "symptoms": ["Water-soaked lesions that can destroy foliage quickly in cool wet weather"],
        "cultural": [
            "Stop overhead watering.",
            "Hill soil over tubers so spores are less likely to wash onto them.",
            "This library does not set a fungicide rate.",
        ],
        "labelReference": [
            "Verify against the current official label before any use. AgroCare does not prescribe this dose. Reference line from the project library: Cymoxanil 8% + Mancozeb 64% WP @ 2.5g/L.",
        ],
    },
    "Corn Northern Leaf Blight": {
        "keywords": ["northern leaf blight", "turcicum", "exserohilum", "corn", "maize"],
        "symptoms": ["Long cigar-shaped lesions along the leaf"],
        "cultural": ["Rotate away from maize and plough under infected residue where that is practical."],
    },
    "Corn Common Rust": {
        "keywords": ["common rust", "puccinia", "corn", "maize"],
        "symptoms": ["Powdery rust pustules on both leaf surfaces"],
        "cultural": ["Note the growth stage and scout again. Resistant hybrids are the main cultural option."],
    },
    "Corn Gray Leaf Spot": {
        "keywords": ["gray leaf spot", "grey leaf spot", "cercospora", "corn", "maize"],
        "symptoms": ["Rectangular gray lesions limited by the leaf veins"],
        "cultural": ["Rotate crops and reduce infected surface residue where practical."],
    },
    "Pepper Bacterial Spot": {
        "keywords": ["bacterial spot", "chilli", "pepper", "xanthomonas"],
        "symptoms": ["Raised or water-soaked spots on chilli leaves and fruit"],
        "cultural": ["Use clean seed and avoid working in wet foliage."],
    },
    "Citrus Greening": {
        "keywords": ["greening", "huanglongbing", "hlb", "citrus", "orange"],
        "symptoms": ["Blotchy mottling of leaves and lopsided fruit"],
        "cultural": [NO_CURE_NOTE, "Report suspected trees to the local horticulture office."],
    },
    "Southern Corn Leaf Blight": {
        "keywords": ["southern corn leaf blight", "bipolaris", "maydis", "corn", "maize"],
        "symptoms": ["Small elongated tan lesions, often between the veins"],
        "cultural": ["Rotate with a non-host crop next season and remove heavily infected residue."],
        "labelReference": [
            "Verify against the current official label before any use. AgroCare does not prescribe this dose. Reference line from the project library: Propiconazole 25% EC @ 1ml/L water.",
        ],
    },
    "Potato Black Scurf": {
        "keywords": ["black scurf", "rhizoctonia", "potato"],
        "symptoms": ["Black scurf resting bodies on tuber skin"],
        "cultural": ["Use clean seed tubers and avoid planting into cold wet soil."],
    },
    "Rice Blast": {
        "keywords": ["blast", "rice", "paddy", "magnaporthe"],
        "symptoms": ["Diamond-shaped lesions with gray centers on rice leaves"],
        "cultural": ["Avoid excess nitrogen and keep a steady water level rather than repeated drying and flooding."],
    },
    "Rice Brown Spot": {
        "keywords": ["brown spot", "rice", "bipolaris oryzae"],
        "symptoms": ["Oval brown spots, often where nutrition is poor"],
        "cultural": ["Correct nutrient stress and use clean seed."],
    },
    "Rice Bacterial Blight": {
        "keywords": ["bacterial blight", "rice", "xanthomonas oryzae"],
        "symptoms": ["Yellow to white lesions that run from the leaf tip along the edges"],
        "cultural": ["Avoid clipping seedlings in muddy water and do not overuse nitrogen."],
    },
    "Rice Sheath Blight": {
        "keywords": ["sheath blight", "rice", "rhizoctonia"],
        "symptoms": ["Oval green-gray lesions on the leaf sheath near the water line"],
        "cultural": ["Reduce very dense planting and excess nitrogen."],
    },
    "Cotton Bacterial Blight": {
        "keywords": ["bacterial blight", "angular", "cotton", "xanthomonas"],
        "symptoms": ["Angular water-soaked spots between the leaf veins"],
        "cultural": ["Use clean seed and remove infected debris. This photo class is not in the image model."],
    },
    "Cotton Grey Mildew": {
        "keywords": ["grey mildew", "gray mildew", "cotton", "ramularia"],
        "symptoms": ["Irregular angular spots with a gray powdery growth"],
        "cultural": ["Improve airflow and remove heavily infected leaves."],
    },
    "Cotton Leaf Curl": {
        "keywords": ["leaf curl", "cotton", "whitefly", "virus"],
        "symptoms": ["Cupped leaves with thickened veins"],
        "cultural": ["Remove infected plants and reduce whitefly hosts around the field.", NO_CURE_NOTE],
    },
    "Chilli Anthracnose": {
        "keywords": ["anthracnose", "die back", "chilli", "colletotrichum"],
        "symptoms": ["Sunken dark spots on ripening fruit"],
        "cultural": ["Pick and destroy infected fruit. Avoid long wetness on the canopy."],
    },
    "Chilli Powdery Mildew": {
        "keywords": ["powdery mildew", "chilli", "leveillula"],
        "symptoms": ["White powdery growth on the underside of leaves"],
        "cultural": ["Remove badly infected leaves and avoid overcrowding."],
    },
    "Chilli Vein Banding": {
        "keywords": ["vein banding", "chilli", "virus"],
        "symptoms": ["Dark green bands along the veins and mottled leaves"],
        "cultural": ["Remove infected plants and control the insect vector habitat.", NO_CURE_NOTE],
    },
    "Wheat Stripe Rust": {
        "keywords": ["stripe rust", "yellow rust", "wheat", "puccinia striiformis"],
        "symptoms": ["Yellow rust pustules arranged in stripes along the veins"],
        "cultural": ["Note the variety and growth stage. Resistant varieties are the main cultural option."],
    },
    "Wheat Powdery Mildew": {
        "keywords": ["powdery mildew", "wheat", "blumeria"],
        "symptoms": ["White powdery patches on the leaf surface"],
        "cultural": ["Avoid an overly dense canopy and excess nitrogen."],
    },
    "Wheat Spot Blotch": {
        "keywords": ["spot blotch", "wheat", "bipolaris sorokiniana"],
        "symptoms": ["Brown oval blotches on leaves, often in warm humid weather"],
        "cultural": ["Use clean seed and rotate away from continuous wheat where practical."],
    },
    "Sugarcane Red Rot": {
        "keywords": ["red rot", "sugarcane", "colletotrichum falcatum"],
        "symptoms": ["Reddened internal stalk tissue with white patches when the cane is split"],
        "cultural": ["Use healthy setts and remove infected clumps."],
    },
    "Sugarcane Smut": {
        "keywords": ["smut", "sugarcane", "whip"],
        "symptoms": ["A black whip-like structure at the shoot tip"],
        "cultural": ["Rogue infected clumps and plant clean setts."],
    },
    "Sugarcane Rust": {
        "keywords": ["rust", "sugarcane", "puccinia"],
        "symptoms": ["Orange to brown pustules on the underside of leaves"],
        "cultural": ["Prefer resistant varieties and avoid very high nitrogen."],
    },
    "Arecanut Koleroga": {
        "keywords": ["koleroga", "mahali", "arecanut", "adike", "fruit rot", "phytophthora"],
        "symptoms": ["Nuts rot and drop during heavy rain", "Dark water-soaked patches on the nuts"],
        "cultural": [
            "Remove and destroy fallen infected nuts. Do not leave them in the garden.",
            "Improve drainage so water does not stand around the palms.",
            "This library does not set a spray rate.",
        ],
    },
    "Arecanut Yellow Leaf Disease": {
        "keywords": ["yellow leaf", "arecanut", "yel", "phytoplasma"],
        "symptoms": ["Yellowing of the leaves from the tip, with smaller nuts"],
        "cultural": [NO_CURE_NOTE, "Mark and remove severely affected palms if the local horticulture office advises it."],
    },
    "Coconut Bud Rot": {
        "keywords": ["bud rot", "coconut", "spindle", "phytophthora"],
        "symptoms": ["The youngest spindle leaf wilts and can be pulled out"],
        "cultural": ["Cut out the rotten spindle tissue and keep rain from collecting in the crown.", "This library has no verified spray dose."],
    },
    "Coconut Root Wilt": {
        "keywords": ["root wilt", "coconut", "flaccid", "phytoplasma"],
        "symptoms": ["Leaves bend abnormally and the leaflets look flabby"],
        "cultural": [NO_CURE_NOTE, "Do not use this photo result as proof of root wilt. Ask the local agriculture office to confirm."],
    },
    "Coffee Leaf Rust": {
        "keywords": ["leaf rust", "coffee", "hemileia", "orange powder"],
        "symptoms": ["Orange powdery spots on the underside of coffee leaves"],
        "cultural": ["Prune for airflow and avoid a dense, always-wet canopy.", "Resistant varieties are the main cultural option. No rate is given here."],
    },
    "Coffee Black Rot": {
        "keywords": ["black rot", "coffee", "koleroga", "phytophthora"],
        "symptoms": ["Dark rot on leaves and berries in prolonged wet weather"],
        "cultural": ["Remove infected leaves and berries and open the canopy so it can dry."],
    },
    "Tea Blister Blight": {
        "keywords": ["blister blight", "tea", "exobasidium"],
        "symptoms": ["Pale translucent spots that become blisters on young tea leaves"],
        "cultural": ["Pluck on schedule and avoid long wetness on young flush.", "This library does not prescribe a fungicide dose."],
    },
    "Tea Grey Blight": {
        "keywords": ["grey blight", "gray blight", "tea", "pestalotiopsis"],
        "symptoms": ["Grey patches on older leaves, often after injury"],
        "cultural": ["Remove badly affected shoots and avoid leaving wounded leaves wet for long periods."],
    },
}

EXTRA_CROPS = {
    "Southern Corn Leaf Blight": "corn",
    "Potato Black Scurf": "potato",
    "Rice Blast": "rice",
    "Rice Brown Spot": "rice",
    "Rice Bacterial Blight": "rice",
    "Rice Sheath Blight": "rice",
    "Cotton Bacterial Blight": "cotton",
    "Cotton Grey Mildew": "cotton",
    "Cotton Leaf Curl": "cotton",
    "Chilli Anthracnose": "chilli",
    "Chilli Powdery Mildew": "chilli",
    "Chilli Vein Banding": "chilli",
    "Wheat Stripe Rust": "wheat",
    "Wheat Powdery Mildew": "wheat",
    "Wheat Spot Blotch": "wheat",
    "Sugarcane Red Rot": "sugarcane",
    "Sugarcane Smut": "sugarcane",
    "Sugarcane Rust": "sugarcane",
    "Arecanut Koleroga": "arecanut",
    "Arecanut Yellow Leaf Disease": "arecanut",
    "Coconut Bud Rot": "coconut",
    "Coconut Root Wilt": "coconut",
    "Coffee Leaf Rust": "coffee",
    "Coffee Black Rot": "coffee",
    "Tea Blister Blight": "tea",
    "Tea Grey Blight": "tea",
}

CROP_BY_ID = {item["cropId"]: item["crop"] for item in CLASSES}
CROP_BY_ID.update({
    "rice": "Rice / Paddy",
    "cotton": "Cotton",
    "wheat": "Wheat",
    "sugarcane": "Sugarcane",
    "corn": "Maize / Corn",
    "chilli": "Chilli",
    "arecanut": "Arecanut",
    "coconut": "Coconut",
    "coffee": "Coffee",
    "tea": "Tea",
})


def _passage(crop_id: str, crop: str, disease: str, pathogen, pathogen_type, healthy: bool, override: dict | None) -> dict:
    override = override or {}
    if healthy:
        symptoms = override.get("symptoms", ["No disease symptoms are recorded for this healthy reference class."])
        cultural = override.get("cultural", HEALTHY_CULTURAL)
    else:
        symptoms = override.get("symptoms", [f"Reference class: {disease}."])
        cultural = override.get("cultural", GENERIC_CULTURAL)
    biological = override.get("biological", GENERIC_BIOLOGICAL)
    keywords = override.get("keywords", [disease.lower(), crop.lower(), crop_id])
    text = " ".join(
        [disease, pathogen or "", crop, " ".join(keywords), " ".join(symptoms), " ".join(cultural), " ".join(biological)]
    )
    return {
        "id": disease.lower().replace(" ", "-"),
        "cropId": crop_id,
        "crop": crop,
        "disease": disease,
        "pathogen": pathogen,
        "pathogenType": pathogen_type,
        "healthy": healthy,
        "keywords": keywords,
        "symptoms": symptoms,
        "culturalControl": cultural,
        "biologicalControl": biological,
        "labelReference": override.get("labelReference", []),
        "safetyNotes": [
            "Wear gloves and a mask if you handle a product.",
            "Pre-harvest and re-entry intervals must be read from the current product label.",
        ],
        "sourceTitle": SOURCE_TITLE,
        "sourceUrl": SOURCE_URL,
        "text": text,
    }


def all_passages() -> list[dict]:
    passages = []
    seen = set()
    for item in CLASSES:
        override = OVERRIDES.get(item["disease"])
        passages.append(
            _passage(
                item["cropId"],
                item["crop"],
                item["disease"],
                item["pathogen"],
                item["pathogenType"],
                item["healthy"],
                override,
            )
        )
        seen.add(item["disease"])
    for disease, crop_id in EXTRA_CROPS.items():
        if disease in seen:
            continue
        override = OVERRIDES[disease]
        passages.append(
            _passage(
                crop_id,
                CROP_BY_ID[crop_id],
                disease,
                None,
                None,
                False,
                override,
            )
        )
    return passages


def passage_for_disease(disease: str | None) -> dict | None:
    if not disease:
        return None
    for item in all_passages():
        if item["disease"].lower() == disease.lower():
            return item
    return None
