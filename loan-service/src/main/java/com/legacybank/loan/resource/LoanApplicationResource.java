package com.legacybank.loan.resource;

import com.legacybank.loan.model.LoanApplication;
import com.legacybank.loan.model.LoanDecision;
import com.legacybank.loan.service.LoanDecisionService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.logging.Logger;

/**
 * REST API endpoint for loan application processing.
 * Provides modern REST interface for legacy COBOL loan approval system.
 */
@Path("/api/v1/loan-applications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Loan Applications", description = "Loan application processing and decision API")
public class LoanApplicationResource {

    private static final Logger LOG = Logger.getLogger(LoanApplicationResource.class);

    @Inject
    LoanDecisionService decisionService;

    @POST
    @Operation(
        summary = "Process loan application",
        description = "Submit a loan application for approval decision. " +
                     "The system evaluates the application against business rules " +
                     "migrated from the legacy COBOL system and returns an approval, " +
                     "review, or decline decision with detailed reasoning."
    )
    @APIResponses({
        @APIResponse(
            responseCode = "200",
            description = "Application processed successfully",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON,
                schema = @Schema(implementation = LoanDecision.class)
            )
        ),
        @APIResponse(
            responseCode = "400",
            description = "Invalid application data"
        ),
        @APIResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    public Response processApplication(
        @RequestBody(
            description = "Loan application details",
            required = true,
            content = @Content(schema = @Schema(implementation = LoanApplication.class))
        )
        @Valid LoanApplication application
    ) {
        try {
            LOG.infof("Received loan application: %s for %s", 
                application.getApplicationId(), application.getApplicantName());

            LoanDecision decision = decisionService.processApplication(application);

            LOG.infof("Application %s decision: %s (%s)", 
                application.getApplicationId(), 
                decision.getDecision(), 
                decision.getReasonCode());

            return Response.ok(decision).build();

        } catch (Exception e) {
            LOG.errorf(e, "Error processing application %s", application.getApplicationId());
            return Response.serverError()
                .entity(new ErrorResponse("Error processing application: " + e.getMessage()))
                .build();
        }
    }

    @GET
    @Path("/health")
    @Operation(
        summary = "Health check",
        description = "Simple health check endpoint for the loan application service"
    )
    @APIResponse(
        responseCode = "200",
        description = "Service is healthy"
    )
    public Response health() {
        return Response.ok(new HealthResponse("Loan Application Service is running")).build();
    }

    /**
     * Error response model.
     */
    @Schema(description = "Error response")
    public static class ErrorResponse {
        @Schema(description = "Error message", example = "Invalid application data")
        public String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }

    /**
     * Health response model.
     */
    @Schema(description = "Health check response")
    public static class HealthResponse {
        @Schema(description = "Status message", example = "Loan Application Service is running")
        public String status;

        public HealthResponse(String status) {
            this.status = status;
        }
    }
}

// Made with Bob
