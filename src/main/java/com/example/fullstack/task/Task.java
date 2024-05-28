package com.example.fullstack.task;

import java.time.ZonedDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Version;

import org.hibernate.annotations.CreationTimestamp;

import com.example.fullstack.project.Project;
import com.example.fullstack.user.User;

import io.quarkus.hibernate.reactive.panache.PanacheEntity;


@Entity
@Table(name = "tasks")
public class Task extends PanacheEntity {
    
    @ManyToOne(optional = false)
    public User user;

    @ManyToOne
    public Project project;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    public ZonedDateTime created;
    
    @Column(length = 1024)
    public String description;
    
    @Column(nullable = false, length = 256)
    public String title;
    
    @Version
    public int version;
    
    public ZonedDateTime complete;

    public Integer priority;

}
