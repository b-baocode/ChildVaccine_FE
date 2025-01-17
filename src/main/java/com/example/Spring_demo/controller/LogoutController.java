package com.example.Spring_demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;




import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/auth")
public class LogoutController {

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Implement your logout logic here
        // For example, invalidate the user's session or token

        // Return a success response
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đăng xuất thành công");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}