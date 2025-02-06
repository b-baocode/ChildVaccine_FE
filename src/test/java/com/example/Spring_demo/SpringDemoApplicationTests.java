package com.example.Spring_demo;

import com.example.Spring_demo.controller.AuthController;
import com.example.Spring_demo.entities.User;
import com.example.Spring_demo.Repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Optional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.mockito.Mockito.when;

@WebMvcTest(AuthController.class)
public class SpringDemoApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private UserRepository userRepository;

	@Test
	public void testLogin() throws Exception {
		// Mock the UserRepository response
		User mockUser = new User("1", "user@example.com", "password", "John Doe", "USER");
		when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(mockUser));

		// Perform the login request and capture the response
		MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
						.contentType("application/json")
						.content("{\"email\": \"user@example.com\", \"password\": \"password\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").exists())
				.andReturn();

		// Extract the token from the response content
		String responseContent = result.getResponse().getContentAsString();
		String token = responseContent.substring(responseContent.indexOf("token\":\"") + 8, responseContent.indexOf("\"", responseContent.indexOf("token\":\"") + 8));

		// Print the token to the console
		System.out.println("Token: " + token);
	}
}