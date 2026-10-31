import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from ai.risk_model import (
    MODEL_NAME,
    feature_vector,
    evaluate_synthetic_holdout,
    predict_suspicious_probability,
    prediction_reasons,
)
from database import Base
from models import User, UserSession
from routes.sessions import SessionRequest, create_session


class RiskModelTests(unittest.TestCase):
    def test_feature_vector_uses_all_model_inputs(self) -> None:
        data = SessionRequest(
            ip_address="192.168.1.42",
            device="Laptop",
            browser="Browser",
            location="Test",
            failed_attempts=3,
            new_device=True,
            location_change=True,
            impossible_travel=False,
            unusual_time=True,
            deepfake_score=0.7,
        )

        self.assertEqual(feature_vector(data), [3.0, 1.0, 1.0, 0.0, 1.0, 0.7])

    def test_model_scores_suspicious_scenario_higher_than_normal(self) -> None:
        normal = SessionRequest(
            ip_address="192.168.1.42",
            device="Laptop",
            browser="Browser",
            location="Test",
        )
        suspicious = SessionRequest(
            ip_address="192.168.1.42",
            device="Laptop",
            browser="Browser",
            location="Test",
            failed_attempts=8,
            new_device=True,
            location_change=True,
            impossible_travel=True,
            unusual_time=True,
            deepfake_score=0.95,
        )

        normal_probability = predict_suspicious_probability(normal)
        suspicious_probability = predict_suspicious_probability(suspicious)

        self.assertGreaterEqual(normal_probability, 0)
        self.assertLessEqual(normal_probability, 1)
        self.assertGreater(suspicious_probability, normal_probability)
        self.assertGreaterEqual(suspicious_probability, 0.5)

    def test_synthetic_holdout_metrics_are_reproducible(self) -> None:
        metrics = evaluate_synthetic_holdout()

        self.assertEqual(metrics["sample_count"], 3_000)
        self.assertEqual(metrics["suspicious_sample_count"], 1_000)
        self.assertGreaterEqual(metrics["accuracy"], 0)
        self.assertLessEqual(metrics["accuracy"], 1)
        self.assertGreaterEqual(metrics["f1"], 0)
        self.assertLessEqual(metrics["f1"], 1)

    def test_model_and_explanatory_signals_are_exposed(self) -> None:
        suspicious = SessionRequest(
            ip_address="192.168.1.42",
            device="Laptop",
            browser="Browser",
            location="Test",
            failed_attempts=3,
            new_device=True,
            impossible_travel=True,
        )

        self.assertIn("Synthetic", MODEL_NAME)
        self.assertEqual(
            prediction_reasons(suspicious),
            [
                "Multiple failed login attempts",
                "New device detected",
                "Impossible travel detected",
            ],
        )

    def test_create_session_returns_and_persists_ml_assessment(self) -> None:
        engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(bind=engine)
        db_factory = sessionmaker(bind=engine, class_=Session)
        db = db_factory()
        user = User(
            username="risk-model-test",
            email="risk-model-test@example.com",
            password="not-used",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        data = SessionRequest(
            ip_address="203.0.113.1",
            device="New device",
            browser="Unknown",
            location="Remote location",
            failed_attempts=8,
            new_device=True,
            location_change=True,
            impossible_travel=True,
            unusual_time=True,
            deepfake_score=0.95,
        )

        result = create_session(data, db, user)
        stored_session = db.query(UserSession).filter(
            UserSession.id == result["session_id"]
        ).one()

        self.assertEqual(result["prediction"], "SUSPICIOUS")
        self.assertEqual(result["risk_score"], stored_session.risk_score)
        self.assertEqual(result["recommended_action"], "BLOCK")
        self.assertEqual(result["model_name"], MODEL_NAME)
        self.assertIn("synthetic", str(result["model_notice"]).lower())

        db.close()
        engine.dispose()


if __name__ == "__main__":
    unittest.main()
