package com.example.Spring_demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Vui lòng nhập email và mật khẩu");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Dummy authentication logic
        if ("user@example.com".equals(email) && "password123".equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
            Map<String, Object> user = new HashMap<>();
            user.put("id", "123e4567-e89b-12d3-a456-426614174000");
            user.put("email", email);
            user.put("fullName", "John Doe");
            user.put("role", "USER");
            response.put("user", user);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email hoặc mật khẩu không chính xác");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
}
