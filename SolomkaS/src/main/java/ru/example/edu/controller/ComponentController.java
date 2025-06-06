package ru.example.edu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ru.example.edu.model.Component;
import ru.example.edu.repository.ComponentRepository;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/component")
public class ComponentController {
    private final ComponentRepository repository;

    public ComponentController(ComponentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Component> getAllComponents() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Component getComponentById(@PathVariable long id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public long addComponent(@RequestBody Component component) {
        Component saved = repository.save(component);
        return saved.getId();
    }

    @PutMapping("/{id}")
    public Component updateComponent(@PathVariable long id, @RequestBody Component component) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(component.getName());
                    existing.setType(component.getType());
                    existing.setDescription(component.getDescription());
                    existing.setSpecs(component.getSpecs());
                    existing.setImageUrl(component.getImageUrl());
                    return repository.save(existing);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteComponent(@PathVariable long id) {
        repository.deleteById(id);
    }

    // Дополнительный endpoint для поиска
    @GetMapping("/search")
    public List<Component> searchComponents(@RequestParam String query) {
        return repository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }
}