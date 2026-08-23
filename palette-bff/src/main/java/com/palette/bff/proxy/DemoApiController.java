package com.palette.bff.proxy;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@ConditionalOnProperty(name = "palette.auth.mode", havingValue = "mock")
public class DemoApiController {

    @GetMapping("/trades")
    public List<Map<String, Object>> trades() {
        return List.of(
                Map.of("id", "TRD-001", "symbol", "AAPL", "side", "BUY", "quantity", 1000, "status", "Settled"),
                Map.of("id", "TRD-002", "symbol", "MSFT", "side", "SELL", "quantity", 500, "status", "Pending"),
                Map.of("id", "TRD-003", "symbol", "GOOGL", "side", "BUY", "quantity", 200, "status", "Settled")
        );
    }
}
