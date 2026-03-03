package com.tudope.openapi_server.repositories;

import com.tudope.openapi_server.entities.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT t FROM Todo t WHERE t.owner.id = :ownerId")
    List<Todo> findAllByOwnerId(@Param("ownerId") Long ownerId);

    @Query("SELECT COUNT(t) > 0 FROM Todo t WHERE t.id = :id AND t.owner.id = :ownerId")
    boolean existsByIdAndOwnerId(@Param("id") Long id, @Param("ownerId") Long ownerId);

}
