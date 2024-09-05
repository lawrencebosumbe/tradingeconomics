package com.trading_economics_bosumbe_api.trading_economics.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class TradingEconomicsService {
    @Value("${tradingeconomics.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public TradingEconomicsService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://brains.tradingeconomics.com/v2").build();
    }

    public Mono<String> getEconomicIndicators(String query) {
        String url = "/search/wb,fred,comtrade?q=" + query + "&pp=50&p=0&_=1557934352427&stance=2";
        return webClient.get()
                .uri(url)
                .header("Authorization", "Bearer " + apiKey) // If an API key or token is required
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(e -> {
                    // Log the error
                    System.err.println("Error fetching data from Trading Economics API: " + e.getMessage());
                })
                .onErrorResume(e -> Mono.error(new RuntimeException("Error fetching data from Trading Economics API", e)));
    }
}
