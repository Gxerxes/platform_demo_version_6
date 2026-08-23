package com.palette.bff.proxy;

import com.palette.bff.api.ApiPaths;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping({ApiPaths.LEGACY_API, ApiPaths.V1_API})
@ConditionalOnProperty(name = "palette.auth.mode", havingValue = "mock")
@Tag(name = "Demo Business API", description = "Mock trading APIs for local development (palette.auth.mode=mock)")
public class DemoApiController {

    private final AtomicInteger tradeSequence = new AtomicInteger(4);
    private final List<Map<String, Object>> trades = new ArrayList<>(List.of(
            createTrade("TRD-001", "AAPL", "BUY", 1000, "Settled", "2026-08-20"),
            createTrade("TRD-002", "MSFT", "SELL", 500, "Pending", "2026-08-22"),
            createTrade("TRD-003", "GOOGL", "BUY", 200, "Settled", "2026-08-21")
    ));

    @GetMapping("/dashboard/summary")
    @Operation(summary = "Dashboard summary", description = "Aggregated trade statistics for the dashboard")
    public Map<String, Object> dashboardSummary() {
        long settled = trades.stream().filter(t -> "Settled".equals(t.get("status"))).count();
        long pending = trades.stream().filter(t -> "Pending".equals(t.get("status"))).count();

        return Map.of(
                "totalTrades", trades.size(),
                "settledTrades", settled,
                "pendingTrades", pending,
                "totalVolume", trades.stream().mapToInt(t -> (Integer) t.get("quantity")).sum(),
                "asOfDate", LocalDate.now().toString()
        );
    }

    @GetMapping("/trades")
    @Operation(summary = "List trades", description = "Returns all mock trades")
    public List<Map<String, Object>> trades() {
        return List.copyOf(trades);
    }

    @PostMapping("/trades")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("@authorizationService.hasPermission('trades:create')")
    @Operation(summary = "Create trade", description = "Creates a new mock trade")
    @ApiResponse(responseCode = "201", description = "Trade created")
    public Map<String, Object> createTrade(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = CreateTradeRequest.class)))
            @RequestBody CreateTradeRequest request) {
        String id = "TRD-" + String.format("%03d", tradeSequence.getAndIncrement());
        Map<String, Object> trade = createTrade(
                id,
                request.symbol().toUpperCase(),
                request.side().toUpperCase(),
                request.quantity(),
                "Pending",
                LocalDate.now().toString()
        );
        trades.add(0, trade);
        return trade;
    }

    @GetMapping("/settlements")
    @Operation(summary = "List settlements", description = "Returns mock settlement records")
    public List<Map<String, Object>> settlements() {
        return List.of(
                Map.of("id", "SET-001", "tradeId", "TRD-001", "amount", 175000.0, "currency", "USD", "status", "Completed", "valueDate", "2026-08-21"),
                Map.of("id", "SET-002", "tradeId", "TRD-003", "amount", 35000.0, "currency", "USD", "status", "Completed", "valueDate", "2026-08-22"),
                Map.of("id", "SET-003", "tradeId", "TRD-002", "amount", 95000.0, "currency", "USD", "status", "Pending", "valueDate", "2026-08-23")
        );
    }

    @GetMapping("/reports/daily")
    @Operation(summary = "Daily report", description = "Returns a generated daily trading report")
    public Map<String, Object> dailyReport() {
        return Map.of(
                "reportDate", LocalDate.now().toString(),
                "buyCount", trades.stream().filter(t -> "BUY".equals(t.get("side"))).count(),
                "sellCount", trades.stream().filter(t -> "SELL".equals(t.get("side"))).count(),
                "topSymbol", "AAPL",
                "generatedAt", java.time.Instant.now().toString()
        );
    }

    private static Map<String, Object> createTrade(
            String id, String symbol, String side, int quantity, String status, String tradeDate) {
        Map<String, Object> trade = new LinkedHashMap<>();
        trade.put("id", id);
        trade.put("symbol", symbol);
        trade.put("side", side);
        trade.put("quantity", quantity);
        trade.put("status", status);
        trade.put("tradeDate", tradeDate);
        return trade;
    }

    public record CreateTradeRequest(
            @Schema(example = "AAPL") String symbol,
            @Schema(example = "BUY", allowableValues = {"BUY", "SELL"}) String side,
            @Schema(example = "100") int quantity) {
    }
}
