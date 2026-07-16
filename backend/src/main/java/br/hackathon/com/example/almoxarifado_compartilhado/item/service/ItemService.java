package br.hackathon.com.example.almoxarifado_compartilhado.item.service;

import br.hackathon.com.example.almoxarifado_compartilhado.item.dto.ItemRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.item.dto.ItemResponse;
import br.hackathon.com.example.almoxarifado_compartilhado.item.entity.Item;
import br.hackathon.com.example.almoxarifado_compartilhado.exception.ItemNotFoundException;
import br.hackathon.com.example.almoxarifado_compartilhado.item.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }


    public ItemResponse createItem(ItemRequest request) {

        Item item = new Item();
        item.setName(request.name());
        item.setDescription(request.description());
        item.setQuantity(request.quantity());

        Item savedItem = itemRepository.save(item);

        return toResponse(savedItem);
    }


    public List<ItemResponse> findAllItems() {

        return itemRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    public Optional<ItemResponse> findItemById(UUID id) {

        return itemRepository.findById(id)
                .map(this::toResponse);
    }


    public ItemResponse updateItem(UUID id, ItemRequest request) {

        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException(id));

        item.setName(request.name());
        item.setDescription(request.description());
        item.setQuantity(request.quantity());

        Item updatedItem = itemRepository.save(item);

        return toResponse(updatedItem);
    }


    public void deleteItem(UUID id) {

        if (!itemRepository.existsById(id)) {
            throw new ItemNotFoundException(id);
        }

        itemRepository.deleteById(id);
    }


    private ItemResponse toResponse(Item item) {

        return new ItemResponse(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getQuantity()
        );
    }
}
