package ru.example.edu.model;

import jakarta.persistence.*;

@Entity
@Table(name = "component")
public class Component {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "specs", length = 1000)
    private String specs;

    @Column(name = "image_url")
    private String imageUrl;

    // Конструкторы
    public Component() {}

    public Component(String name, String type, String description, String specs, String imageUrl) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.specs = specs;
        this.imageUrl = imageUrl;
    }

    // Геттеры и сеттеры
    public long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSpecs() { return specs; }
    public void setSpecs(String specs) { this.specs = specs; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}