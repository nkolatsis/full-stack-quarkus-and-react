package com.example.fullstack.project;

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;

import org.jboss.resteasy.reactive.ResponseStatus;

import io.smallrye.mutiny.Uni;

@Path("/api/v1/projects")
public class ProjectResource {
    
    private final ProjectService projectService;

    @Inject
    public ProjectResource(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GET
    public Uni<List<Project>> get() {
        return projectService.listForUser();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @ResponseStatus(201)
    public Uni<Project> create(Project project) {
        return projectService.create(project);
    }
    
    //@PUT
    // update(Project project)
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Uni<Project> update(@PathParam("id") long id, Project project) {
        project.id = id;
        return projectService.update(project);
    }

    @DELETE
    @Path("/{id}")
    public Uni<Void> delete(@PathParam("id") long id) {
        return projectService.delete(id);
    }
}