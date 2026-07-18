package br.hackathon.com.example.almoxarifado_compartilhado.produto.controller;

import br.hackathon.com.example.almoxarifado_compartilhado.produto.dto.ProdutoPatchRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.dto.ProdutoRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.dto.ProdutoResponse;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/produtos")
@Tag(name = "Produtos", description = "Gerenciamento de produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cadastrar produto")
    public ProdutoResponse create(@Valid @RequestBody ProdutoRequest request) {
        return produtoService.createProduto(request);
    }

    @GetMapping
    @Operation(summary = "Listar todos os produtos")
    public List<ProdutoResponse> findAll() {
        return produtoService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar produto por ID")
    public ProdutoResponse findById(@PathVariable UUID id) {
        return produtoService.findById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar produto")
    public ProdutoResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody ProdutoRequest request) {

        return produtoService.update(id, request);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar produto parcialmente")
    public ProdutoResponse patch(
            @PathVariable UUID id,
            @RequestBody ProdutoPatchRequest request) {

        return produtoService.patch(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir produto")
    public void delete(@PathVariable UUID id) {
        produtoService.delete(id);
    }
}