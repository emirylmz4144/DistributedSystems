package com.example.app2.Controller;

import com.example.app2.Repository.KisiRepository;
import com.example.app2.Model.Kisi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kisiler")
public class KisiController {

    @Autowired
    private KisiRepository kisiRepository;

    @PostMapping("/kaydet")
    public Kisi kisiKaydet(@RequestBody Kisi kisi) {
        return kisiRepository.save(kisi);
    }

    @GetMapping("/liste")
    public List<Kisi> kisiListele() {
        return kisiRepository.findAll();
    }
}
