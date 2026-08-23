package com.palette.bff;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
class PaletteBffApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() {
    }

    @Test
    void healthEndpointIsAvailable() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }

    @Test
    void mockUserEndpointReturnsUserInfo() throws Exception {
        mockMvc.perform(get("/api/auth/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("demo-user"))
                .andExpect(jsonPath("$.username").value("demo"));
    }

    @Test
    void demoTradesEndpointWorksInMockMode() throws Exception {
        mockMvc.perform(get("/api/trades"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("TRD-001"));
    }

    @Test
    void dashboardSummaryEndpointWorksInMockMode() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTrades").exists());
    }

    @Test
    void settlementsEndpointWorksInMockMode() throws Exception {
        mockMvc.perform(get("/api/settlements"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("SET-001"));
    }

    @Test
    void swaggerUiIsAvailable() throws Exception {
        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk());
    }

    @Test
    void openApiDocsAreAvailable() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.title").value("Palette BFF API"));
    }

    @Test
    void v1AuthUserEndpointWorksInMockMode() throws Exception {
        mockMvc.perform(get("/palette/api/v1/auth/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("demo-user"));
    }
}
