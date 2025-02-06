package com.example.Spring_demo.controller;

import com.example.Spring_demo.entities.User;
import com.example.Spring_demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Vui lòng nhập email và mật khẩu");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."); // Generate a real token here
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("email", user.getEmail());
                userInfo.put("fullName", user.getFullName());
                userInfo.put("role", user.getRole());
                response.put("user", userInfo);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email hoặc mật khẩu không chính xác");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email hoặc mật khẩu không chính xác");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
}
