from pydantic import BaseModel, Field


class RegisterIn(BaseModel):
    name: str
    mobile: str
    location: str = ""
    acreage: str = ""
    selectedCrops: list[str] = Field(default_factory=list)
    password: str
    village: str = ""
    state: str = ""


class LoginIn(BaseModel):
    identifier: str
    password: str
    role: str | None = None


class ForgotIn(BaseModel):
    mobile: str


class ResetIn(BaseModel):
    mobile: str
    otp: str
    newPassword: str


class ProfilePatch(BaseModel):
    name: str | None = None
    mobile: str | None = None
    location: str | None = None
    village: str | None = None
    state: str | None = None
    acreage: str | None = None
    soilType: str | None = None
    irrigation: str | None = None
    language: str | None = None
    selectedCrops: list[str] | None = None


class PreferenceIn(BaseModel):
    smsAlerts: bool = False
    whatsAppAlerts: bool = False


class CaseCreate(BaseModel):
    diagnosisId: int
    variety: str = ""
    field: str = ""
    farmerNotes: str = ""


class CasePatch(BaseModel):
    variety: str | None = None
    field: str | None = None
    nextFollowUp: str | None = None
    status: str | None = None


class CloseIn(BaseModel):
    confirm: bool = False
    noNewSymptoms: bool = False


class ExpertRequestIn(BaseModel):
    note: str = ""


class TreatmentLogIn(BaseModel):
    date: str | None = None
    action: str
    type: str


class ChatIn(BaseModel):
    text: str


class ReviewIn(BaseModel):
    caseId: str
    verifiedDisease: str
    severityPercent: int = Field(ge=0, le=100)
    note: str = ""
    decision: str
