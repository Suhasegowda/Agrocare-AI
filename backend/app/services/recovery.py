def assess_follow_up(
    *,
    image_present: bool,
    blurry: bool,
    same_plant: bool,
    new_lesions: bool,
    symptoms_consistent: bool,
    no_new_symptoms: bool,
    conflict: bool,
) -> dict:
    if not image_present or blurry:
        return {
            "assessment": "retake",
            "updateStatus": None,
            "message": "The follow-up image is missing or too blurry. Please retake a sharp photo of the same leaf.",
        }
    if not same_plant:
        return {
            "assessment": "inconclusive",
            "updateStatus": None,
            "message": "The plant or leaf does not match the original case. The comparison is uncertain.",
        }
    if conflict or (new_lesions and no_new_symptoms):
        return {
            "assessment": "inconclusive",
            "updateStatus": None,
            "message": "The observations conflict. The recovery status is inconclusive.",
        }
    if new_lesions:
        return {
            "assessment": "worsening",
            "updateStatus": "Active",
            "message": "New lesions or spread were reported. This is a possible worsening, not a measured severity score.",
        }
    if no_new_symptoms and symptoms_consistent:
        return {
            "assessment": "improving",
            "updateStatus": "In Recovery",
            "message": "No new symptoms were reported and the observations agree. This is a possible improvement, not proof of cure.",
        }
    if symptoms_consistent and not new_lesions:
        return {
            "assessment": "stable",
            "updateStatus": "In Recovery",
            "message": "Observations look consistent and no new spread was reported. Marked stable, not cured.",
        }
    return {
        "assessment": "inconclusive",
        "updateStatus": None,
        "message": "There is not enough consistent evidence to judge recovery.",
    }
