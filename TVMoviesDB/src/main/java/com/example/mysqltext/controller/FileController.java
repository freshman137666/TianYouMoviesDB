package com.example.mysqltext.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/files")
public class FileController {

    @Value("${file.upload.path:uploads}")
    private String uploadPath;

    @PostMapping("/upload")
    @ResponseBody
    public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        
        if (file.isEmpty()) {
            result.put("success", false);
            result.put("message", "请选择文件");
            return result;
        }

        try {
            Path directory = Paths.get(uploadPath);
            Files.createDirectories(directory);
            
            // 生成唯一文件名避免冲突
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = System.currentTimeMillis() + fileExtension;
            
            Path filePath = directory.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // 返回文件访问URL
            String fileUrl = "/files/" + fileName;
            result.put("success", true);
            result.put("message", "文件上传成功");
            result.put("url", fileUrl);
            result.put("fileName", fileName);
            return result;
        } catch (IOException e) {
            result.put("success", false);
            result.put("message", "文件上传失败：" + e.getMessage());
            return result;
        }
    }

    @GetMapping("/{fileName}")
    @ResponseBody
    public void getFile(@PathVariable String fileName, HttpServletResponse response) {
        try {
            Path filePath = Paths.get(uploadPath).resolve(fileName);
            if (!Files.exists(filePath)) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            response.setContentType(contentType);
            Files.copy(filePath, response.getOutputStream());
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}