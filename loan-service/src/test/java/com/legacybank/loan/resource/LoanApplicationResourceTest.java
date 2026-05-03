package com.legacybank.loan.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for LoanApplicationResource REST API.
 * Tests the complete HTTP request/response cycle.
 */
@QuarkusTest
@DisplayName("Loan Application REST API Integration Tests")
class LoanApplicationResourceTest {

    @Test
    @DisplayName("Should process valid application and return 200 OK")
    void shouldProcessValidApplication() {
        String requestBody = """
            {
              "applicationId": "TEST001",
              "applicantName": "TEST APPLICANT",
              "loanType": "MORTGAGE",
              "annualIncome": 100000,
              "loanAmount": 300000,
              "monthlyDebt": 1000,
              "creditScore": 750,
              "employmentMonths": 60,
              "bankruptcyYears": 99,
              "delinquencyCount": 0,
              "downPayment": 60000
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("/api/v1/loan-applications")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("applicationId", equalTo("TEST001"))
            .body("applicantName", equalTo("TEST APPLICANT"))
            .body("decision", equalTo("APPROVED"))
            .body("riskGrade", equalTo("A"))
            .body("approvedApr", notNullValue())
            .body("reasonCode", equalTo("A001"))
            .body("reasonText", containsString("APPROVED"));
    }

    @Test
    @DisplayName("Should decline application with low credit score")
    void shouldDeclineApplicationWithLowCreditScore() {
        String requestBody = """
            {
              "applicationId": "TEST002",
              "applicantName": "LOW CREDIT",
              "loanType": "MORTGAGE",
              "annualIncome": 100000,
              "loanAmount": 300000,
              "monthlyDebt": 1000,
              "creditScore": 550,
              "employmentMonths": 60,
              "bankruptcyYears": 99,
              "delinquencyCount": 0,
              "downPayment": 60000
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("/api/v1/loan-applications")
        .then()
            .statusCode(200)
            .body("decision", equalTo("DECLINED"))
            .body("reasonCode", equalTo("D001"))
            .body("approvedApr", equalTo(0));
    }

    @Test
    @DisplayName("Should require manual review for low down payment")
    void shouldRequireManualReviewForLowDownPayment() {
        String requestBody = """
            {
              "applicationId": "TEST003",
              "applicantName": "LOW DOWN PAYMENT",
              "loanType": "MORTGAGE",
              "annualIncome": 100000,
              "loanAmount": 300000,
              "monthlyDebt": 1000,
              "creditScore": 750,
              "employmentMonths": 60,
              "bankruptcyYears": 99,
              "delinquencyCount": 0,
              "downPayment": 30000
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("/api/v1/loan-applications")
        .then()
            .statusCode(200)
            .body("decision", equalTo("REVIEW"))
            .body("reasonCode", equalTo("R101"))
            .body("approvedApr", equalTo(0));
    }

    @Test
    @DisplayName("Should return 400 for invalid application data")
    void shouldReturn400ForInvalidData() {
        String requestBody = """
            {
              "applicationId": "TEST004",
              "applicantName": "INVALID DATA",
              "loanType": "MORTGAGE",
              "annualIncome": -1000,
              "loanAmount": 300000,
              "monthlyDebt": 1000,
              "creditScore": 750,
              "employmentMonths": 60,
              "bankruptcyYears": 99,
              "delinquencyCount": 0,
              "downPayment": 60000
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("/api/v1/loan-applications")
        .then()
            .statusCode(400);
    }

    @Test
    @DisplayName("Should return 400 for missing required fields")
    void shouldReturn400ForMissingFields() {
        String requestBody = """
            {
              "applicationId": "TEST005",
              "applicantName": "MISSING FIELDS"
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("/api/v1/loan-applications")
        .then()
            .statusCode(400);
    }

    @Test
    @DisplayName("Should return calculated ratios in response")
    void shouldReturnCalculatedRatios() {
        String requestBody = """
            {
              "applicationId": "TEST006",
              "applicantName": "RATIO TEST",
              "loanType": "MORTGAGE",
              "annualIncome": 100000,
              "loanAmount": 300000,
              "monthlyDebt": 2000,
              "creditScore": 750,
              "employmentMonths": 60,
              "bankruptcyYears": 99,
              "delinquencyCount": 0,
              "downPayment": 60000
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post("/api/v1/loan-applications")
        .then()
            .statusCode(200)
            .body("debtToIncomeRatio", notNullValue())
            .body("loanToIncomeRatio", notNullValue())
            .body("downPaymentPercentage", notNullValue())
            .body("creditScore", equalTo(750))
            .body("loanType", equalTo("MORTGAGE"));
    }

    @Test
    @DisplayName("Health check should return 200 OK")
    void shouldReturnHealthCheck() {
        given()
        .when()
            .get("/api/v1/loan-applications/health")
        .then()
            .statusCode(200)
            .body("status", containsString("running"));
    }

    @Test
    @DisplayName("Should handle all COBOL test cases correctly")
    void shouldHandleCobolTestCases() {
        // Test Case 1: ALICE MARTIN - Approved
        String aliceMartin = """
            {
              "applicationId": "10001",
              "applicantName": "ALICE MARTIN",
              "loanType": "MORTGAGE",
              "annualIncome": 95000,
              "loanAmount": 320000,
              "monthlyDebt": 900,
              "creditScore": 780,
              "employmentMonths": 60,
              "bankruptcyYears": 99,
              "delinquencyCount": 0,
              "downPayment": 100000
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(aliceMartin)
        .when()
            .post("/api/v1/loan-applications")
        .then()
            .statusCode(200)
            .body("decision", equalTo("APPROVED"))
            .body("approvedApr", equalTo(6.75f));

        // Test Case 2: BRIAN CHEN - Review
        String brianChen = """
            {
              "applicationId": "10002",
              "applicantName": "BRIAN CHEN",
              "loanType": "AUTO",
              "annualIncome": 62000,
              "loanAmount": 28000,
              "monthlyDebt": 1200,
              "creditScore": 710,
              "employmentMonths": 36,
              "bankruptcyYears": 99,
              "delinquencyCount": 0,
              "downPayment": 2000
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(brianChen)
        .when()
            .post("/api/v1/loan-applications")
        .then()
            .statusCode(200)
            .body("decision", equalTo("REVIEW"))
            .body("reasonCode", equalTo("R102"));

        // Test Case 3: CARLA DIAZ - Declined
        String carlaDiaz = """
            {
              "applicationId": "10003",
              "applicantName": "CARLA DIAZ",
              "loanType": "PERSONAL",
              "annualIncome": 48000,
              "loanAmount": 45000,
              "monthlyDebt": 2300,
              "creditScore": 650,
              "employmentMonths": 48,
              "bankruptcyYears": 12,
              "delinquencyCount": 0,
              "downPayment": 0
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(carlaDiaz)
        .when()
            .post("/api/v1/loan-applications")
        .then()
            .statusCode(200)
            .body("decision", equalTo("DECLINED"))
            .body("reasonCode", equalTo("D002"));
    }
}

// Made with Bob
