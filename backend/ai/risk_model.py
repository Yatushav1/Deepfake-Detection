import random
from typing import Protocol
from sklearn.ensemble import RandomForestClassifier  # pyright: ignore[reportMissingModuleSource]
from sklearn.metrics import accuracy_score, f1_score  # pyright: ignore[reportMissingModuleSource]


MODEL_NAME = "AuthPulse Synthetic Risk Forest v1"
MODEL_NOTICE = (
    "Prototype model trained on synthetic scenarios; not validated for "
    "production authentication decisions."
)
FEATURE_NAMES = (
    "failed_attempts",
    "new_device",
    "location_change",
    "impossible_travel",
    "unusual_time",
    "deepfake_score",
)


class RiskFeatures(Protocol):
    failed_attempts: int
    new_device: bool
    location_change: bool
    impossible_travel: bool
    unusual_time: bool
    deepfake_score: float


def _sample_training_data(
    seed: int = 42,
    samples_per_class: tuple[int, int] = (4_000, 2_000),
) -> tuple[list[list[float]], list[int]]:
    generator = random.Random(seed)
    samples: list[list[float]] = []
    labels: list[int] = []

    for label, count in enumerate(samples_per_class):
        for _ in range(count):
            if label == 0:
                failed_attempts = generator.choices(
                    [0, 1, 2, 3, 5],
                    weights=[68, 20, 8, 3, 1],
                )[0]
                new_device = generator.random() < 0.08
                location_change = generator.random() < 0.035
                impossible_travel = generator.random() < 0.003
                unusual_time = generator.random() < 0.16
                deepfake_score = generator.betavariate(1.2, 18)
            else:
                failed_attempts = generator.choices(
                    [0, 1, 2, 3, 5, 8, 12],
                    weights=[12, 12, 14, 20, 22, 14, 6],
                )[0]
                new_device = generator.random() < 0.58
                location_change = generator.random() < 0.43
                impossible_travel = generator.random() < 0.19
                unusual_time = generator.random() < 0.4
                deepfake_score = generator.betavariate(2.3, 2.2)

            samples.append(
                [
                    float(failed_attempts),
                    float(new_device),
                    float(location_change),
                    float(impossible_travel),
                    float(unusual_time),
                    deepfake_score,
                ]
            )
            labels.append(label)

    return samples, labels


def _build_model() -> RandomForestClassifier:
    samples, labels = _sample_training_data()
    model = RandomForestClassifier(
        n_estimators=120,
        max_depth=8,
        min_samples_leaf=3,
        class_weight="balanced",
        random_state=42,
        n_jobs=1,
    )
    model.fit(samples, labels)
    return model


_model = _build_model()


def feature_vector(data: RiskFeatures) -> list[float]:
    return [
        float(data.failed_attempts),
        float(data.new_device),
        float(data.location_change),
        float(data.impossible_travel),
        float(data.unusual_time),
        float(data.deepfake_score),
    ]


def predict_suspicious_probability(data: RiskFeatures) -> float:
    probabilities = _model.predict_proba([feature_vector(data)])[0]
    suspicious_class_index = list(_model.classes_).index(1)
    return float(probabilities[suspicious_class_index])


def evaluate_synthetic_holdout() -> dict[str, float | int]:
    samples, labels = _sample_training_data(
        seed=2026,
        samples_per_class=(2_000, 1_000),
    )
    predictions = _model.predict(samples)
    return {
        "accuracy": float(accuracy_score(labels, predictions)),
        "f1": float(f1_score(labels, predictions, pos_label=1)),
        "sample_count": len(labels),
        "suspicious_sample_count": sum(labels),
    }


def prediction_reasons(data: RiskFeatures) -> list[str]:
    reasons: list[str] = []
    if data.failed_attempts >= 3:
        reasons.append("Multiple failed login attempts")
    if data.new_device:
        reasons.append("New device detected")
    if data.location_change:
        reasons.append("Location changed")
    if data.impossible_travel:
        reasons.append("Impossible travel detected")
    if data.unusual_time:
        reasons.append("Unusual login time")
    if data.deepfake_score > 0.5:
        reasons.append("Elevated deepfake signal")
    return reasons
