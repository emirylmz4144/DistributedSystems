package com.example.app1.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "kisiler")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Kisi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String isim;
    private String departman;
}
