package com.example.Spring_demo.controller;

import com.example.Spring_demo.entities.User;
import com.example.Spring_demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class RegisterController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        String email = registerRequest.get("email");
        String password = registerRequest.get("password");
        String fullName = registerRequest.get("fullName");

        if (email == null || password == null || fullName == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Dữ liệu không hợp lệ");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Check if the user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email đã được sử dụng");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }

        // Create a new user and save to the database
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setFullName(fullName);
        user.setRole("USER"); // Set default role

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Đăng ký thành công");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
