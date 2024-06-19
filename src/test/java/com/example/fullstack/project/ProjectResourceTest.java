package com.example.fullstack.project;

import static io.restassured.RestAssured.given;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.hasEntry;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.nullValue;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.example.fullstack.task.Task;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;

@QuarkusTest
public class ProjectResourceTest {
    
    @Test
    @TestSecurity(user = "user", roles = "user")
    void list() {
        given()
            .when().get("/api/v1/projects")
            .then()
            .statusCode(200)
            .body("$",
                hasItem(allOf(hasEntry("name", "Work")))
            );

    }

    @Disabled
    @Test
    void create() {

    }

    @Disabled
    @Test
    void createDuplicate() {

    }

    @Disabled
    @Test
    void update() {

    }

    @Disabled
    @Test
    void updateNotFound() {

    }

    @Disabled
    @Test
    void updateUnauthorized() {

    }

    @Test
    @TestSecurity(user = "user", roles = "user")
    void delete() {
        var toDelete = given().body("{\"name\":\"to-delete\"}")
            .contentType(ContentType.JSON)
            .post("/api/v1/projects")
            .as(Project.class);

        var dependentTask = given()
            .body("{\"title\":\"dependent-task\", \"project\":{\"id\":" + toDelete.id + "}}")
            .contentType(ContentType.JSON)
            .post("/api/v1/tasks")
            .as(Task.class);

        given()
            .when().delete("/api/v1/projects/" + toDelete.id)
            .then()
            .statusCode(204);
        
        assertThat(Task.<Task>findById(dependentTask.id).await().indefinitely().project, nullValue());
    }
}
