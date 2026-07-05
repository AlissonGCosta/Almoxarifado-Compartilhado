package br.hackathon.com.example.almoxarifado_compartilhado.item.controller;

import br.hackathon.com.example.almoxarifado_compartilhado.item.dto.ItemRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.item.dto.ItemResponse;
import br.hackathon.com.example.almoxarifado_compartilhado.item.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "Itens",
        description = "Operações de gerenciamento de itens do almoxarifado"
)
@RestController
@RequestMapping("/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @Operation(summary = "Cadastrar um novo item")
    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody ItemRequest request) {
        return ResponseEntity.ok(itemService.createItem(request));
    }

    @Operation(summary = "Listar todos os itens")
    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAllItems() {
        return ResponseEntity.ok(itemService.findAllItems());
    }

    @Operation(summary = "Buscar um item pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable Long id) {
        return itemService.findItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Atualizar um item")
    @PutMapping("/{id}")
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody ItemRequest request) {

        return ResponseEntity.ok(itemService.updateItem(id, request));
    }

    @Operation(summary = "Excluir um item")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}