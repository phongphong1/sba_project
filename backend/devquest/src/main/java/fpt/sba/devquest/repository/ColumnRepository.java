package fpt.sba.devquest.repository;

import fpt.sba.devquest.entity.Column;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ColumnRepository extends JpaRepository<Column, Long> {
    long countByBoard_Id(Long boardId);

    List<Column> findByBoard_IdOrderByPositionAsc(Long boardId);

    Optional<Column> findByIdAndBoard_Id(Long id, Long boardId);
}
