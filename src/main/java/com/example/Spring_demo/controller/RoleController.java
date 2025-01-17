package com.example.Spring_demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class RoleController {
    @GetMapping("/role")
    public ResponseEntity<?> checkRole(@RequestHeader("Authorization") String token) {
        // Dummy logic to determine the role based on the token
        // Replace this with actual logic to fetch the user's role from the database or token

        String role = "CUSTOMER"; // Default role for demonstration

        // Example logic to determine role (replace with actual logic)
        if (token != null && token.equals("admin_token")) {
            role = "ADMIN";
        } else if (token != null && token.equals("staff_token")) {
            role = "STAFF";
        }

        // Return the role in the response
        Map<String, String> response = new HashMap<>();
        response.put("role", role);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
