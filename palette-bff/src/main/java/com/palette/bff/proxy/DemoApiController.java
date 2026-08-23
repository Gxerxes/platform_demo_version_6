package com.palette.bff.proxy;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api")
@ConditionalOnProperty(name = "palette.auth.mode", havingValue = "mock")
public class DemoApiController {

    private final AtomicInteger tradeSequence = new AtomicInteger(4);
    private final List<Map<String, Object>> trades = new ArrayList<>(List.of(
            createTrade("TRD-001", "AAPL", "BUY", 1000, "Settled", "2026-08-20"),
            createTrade("TRD-002", "MSFT", "SELL", 500, "Pending", "2026-08-22"),
            createTrade("TRD-003", "GOOGL", "BUY", 200, "Settled", "2026-08-21")
    ));

    @GetMapping("/dashboard/summary")
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
    public List<Map<String, Object>> trades() {
        return List.copyOf(trades);
    }

    @PostMapping("/trades")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createTrade(@RequestBody CreateTradeRequest request) {
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
    public List<Map<String, Object>> settlements() {
        return List.of(
                Map.of("id", "SET-001", "tradeId", "TRD-001", "amount", 175000.0, "currency", "USD", "status", "Completed", "valueDate", "2026-08-21"),
                Map.of("id", "SET-002", "tradeId", "TRD-003", "amount", 35000.0, "currency", "USD", "status", "Completed", "valueDate", "2026-08-22"),
                Map.of("id", "SET-003", "tradeId", "TRD-002", "amount", 95000.0, "currency", "USD", "status", "Pending", "valueDate", "2026-08-23")
        );
    }

    @GetMapping("/reports/daily")
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

    public record CreateTradeRequest(String symbol, String side, int quantity) {
    }
}
