package br.hackathon.com.example.almoxarifado_compartilhado.produto.service;

import br.hackathon.com.example.almoxarifado_compartilhado.produto.dto.ProdutoPatchRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.dto.ProdutoRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.dto.ProdutoResponse;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.entity.ProdutoEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.repository.ProdutoRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.repository.SecretariasRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final UserRepository userRepository;
    private final SecretariasRepository secretariasRepository;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            UserRepository userRepository,
            SecretariasRepository secretariasRepository) {

        this.produtoRepository = produtoRepository;
        this.userRepository = userRepository;
        this.secretariasRepository = secretariasRepository;
    }

    public ProdutoResponse createProduto(ProdutoRequest request) {

        UserEntity usuario = userRepository.findById(request.usuarioCadastrado())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        SecretariaEntity secretaria = secretariasRepository.findById(request.secretariaCadastrada())
                .orElseThrow(() -> new RuntimeException("Secretaria não encontrada"));

        ProdutoEntity produto = ProdutoEntity.builder()
                .nome(request.nome())
                .descricao(request.descricao())
                .quantidade(request.quantidade())
                .preco(request.preco())
                .status(request.status())
                .type(request.type())
                .usuarioCadastrado(usuario)
                .secretariaCadastrada(secretaria)
                .build();

        return toResponse(produtoRepository.save(produto));
    }

    public List<ProdutoResponse> findAll() {
        return produtoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProdutoResponse findById(UUID id) {

        ProdutoEntity produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        return toResponse(produto);
    }

    public ProdutoResponse update(UUID id, ProdutoRequest request) {

        ProdutoEntity produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        UserEntity usuario = userRepository.findById(request.usuarioCadastrado())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        SecretariaEntity secretaria = secretariasRepository.findById(request.secretariaCadastrada())
                .orElseThrow(() -> new RuntimeException("Secretaria não encontrada"));

        produto.setNome(request.nome());
        produto.setDescricao(request.descricao());
        produto.setQuantidade(request.quantidade());
        produto.setPreco(request.preco());
        produto.setStatus(request.status());
        produto.setType(request.type());
        produto.setUsuarioCadastrado(usuario);
        produto.setSecretariaCadastrada(secretaria);

        return toResponse(produtoRepository.save(produto));
    }

    public ProdutoResponse patch(UUID id, ProdutoPatchRequest request) {

        ProdutoEntity produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (request.nome() != null) {
            produto.setNome(request.nome());
        }

        if (request.descricao() != null) {
            produto.setDescricao(request.descricao());
        }

        if (request.quantidade() != null) {
            produto.setQuantidade(request.quantidade());
        }

        if (request.preco() != null) {
            produto.setPreco(request.preco());
        }

        if (request.status() != null) {
            produto.setStatus(request.status());
        }

        if (request.type() != null) {
            produto.setType(request.type());
        }

        if (request.usuarioCadastrado() != null) {
            UserEntity usuario = userRepository.findById(request.usuarioCadastrado())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            produto.setUsuarioCadastrado(usuario);
        }

        if (request.secretariaCadastrada() != null) {
            SecretariaEntity secretaria = secretariasRepository.findById(request.secretariaCadastrada())
                    .orElseThrow(() -> new RuntimeException("Secretaria não encontrada"));
            produto.setSecretariaCadastrada(secretaria);
        }

        return toResponse(produtoRepository.save(produto));
    }

    public void delete(UUID id) {

        ProdutoEntity produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produtoRepository.delete(produto);
    }

    private ProdutoResponse toResponse(ProdutoEntity produto) {

        return new ProdutoResponse(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getQuantidade(),
                produto.getPreco(),
                produto.getStatus(),
                produto.getType(),
                produto.getUsuarioCadastrado().getId(),
                produto.getSecretariaCadastrada().getId(),
                produto.getCreatedAt(),
                produto.getUpdatedAt()
        );
    }
}