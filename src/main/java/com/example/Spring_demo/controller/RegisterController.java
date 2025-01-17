package com.example.Spring_demo.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class RegisterController {
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        String email = registerRequest.get("email");
        String password = registerRequest.get("password");
        String fullName = registerRequest.get("fullName");
        String phone = registerRequest.get("phone");

        if (email == null || password == null || fullName == null || phone == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Dữ liệu không hợp lệ");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Dummy registration logic
        // Here you would typically save the user to the database
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đăng ký thành công");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
