package com.example.fullstack.task;

import static io.restassured.RestAssured.given;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasEntry;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;

import org.hamcrest.Matcher;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;

@QuarkusTest
public class TaskResourceTest {

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Test
    @TestSecurity(user = "user", roles = "user")
    void list() {
        given()
            .body("{\"title\": \"to-be-listed\"}")
            .contentType(ContentType.JSON)
            .when().post("/api/v1/tasks")
            .as(Task.class);
        given()
            .when().get("/api/v1/tasks")
            .then()
            .statusCode(200)
            .body("$",
                allOf(
                    hasItem(
                        hasEntry("title", "to-be-listed")
                    ),
                    everyItem(
                        hasEntry(is("user"), (Matcher)hasEntry("name", "user"))
                    )
                )
            );
    }

    @Disabled
    @Test
    void create() {

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
    void updateForbidden() {

    }

    @Disabled
    @Test
    void delete() {

    }

    @Test
    @TestSecurity(user = "user", roles = "user")
    void setComplete() {
        var toSetComplete = given()
            .body("{\"title\":\"to-set-complete\"}")
            .contentType(ContentType.JSON)
            .post("/api/v1/tasks")
            .as(Task.class);

        given()
            .body("\"true\"")
            .contentType(ContentType.JSON)
            .when().put("/api/v1/tasks/" + toSetComplete.id + "/complete")
            .then()
            .statusCode(200);

        assertThat(
            Task.findById(toSetComplete.id).await().indefinitely(),
            allOf(
                hasProperty("complete", notNullValue()),
                hasProperty("version", is(toSetComplete.version + 1))
            )
        );

    }

}
