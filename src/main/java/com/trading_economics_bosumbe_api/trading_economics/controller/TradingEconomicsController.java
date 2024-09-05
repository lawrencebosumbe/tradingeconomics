package com.trading_economics_bosumbe_api.trading_economics.controller;

import com.trading_economics_bosumbe_api.trading_economics.service.TradingEconomicsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@CrossOrigin("*")
@RestController
public class TradingEconomicsController {
    private final TradingEconomicsService tradingEconomicsService;

    public TradingEconomicsController(TradingEconomicsService tradingEconomicsService) {
        this.tradingEconomicsService = tradingEconomicsService;
    }

    @GetMapping("/indicators/{query}")
    public Mono<String> getEconomicIndicators(@PathVariable String query) {
        // Fetch economic indicators from the service
        return tradingEconomicsService.getEconomicIndicators(query)
                .onErrorResume(e -> {
                    // Log the error and return a generic error message
                    System.err.println("Error in Controller: " + e.getMessage());
                    return Mono.error(new RuntimeException("Internal Server Error"));
                });
    }
}
