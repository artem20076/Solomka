package ru.example.edu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.example.edu.model.Component;
import java.util.List;

public interface ComponentRepository extends JpaRepository<Component, Long> {

    // Метод для поиска по названию или описанию (без учета регистра)
    List<Component> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

}