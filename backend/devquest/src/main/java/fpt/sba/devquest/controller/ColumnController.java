package fpt.sba.devquest.controller;

import fpt.sba.devquest.dto.column.ColumnResponse;
import fpt.sba.devquest.dto.column.ReorderColumnsRequest;
import fpt.sba.devquest.dto.column.UpdateColumnRequest;
import fpt.sba.devquest.service.ColumnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/columns")
@RequiredArgsConstructor
public class ColumnController {

    private final ColumnService columnService;

    @PatchMapping("/reorder")
    public void reorder(@Valid @RequestBody ReorderColumnsRequest request) {
        columnService.reorderColumns(request);
    }

    @PatchMapping("/{id}")
    public ColumnResponse update(@PathVariable Long id, @RequestBody UpdateColumnRequest request) {
        return columnService.updateColumn(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        columnService.deleteColumn(id);
    }
}
