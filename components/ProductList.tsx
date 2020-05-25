import ProductRow from './ProductRow';
import {List, Device} from '@prisma/client';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useState, useCallback, useEffect} from 'react';
import EmojiPicker from './EmojiPicker';
import {Card, Button} from 'antd';
import {CheckCircleOutlined, DeleteOutlined} from '@ant-design/icons';
import styles from './ProductList.module.css';

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export type ProductT = {id: string; name: string | null; price: number | null};

function generateRow(name: string | null, price: number | null): ProductT {
  return {id: Math.random().toString(36), name, price};
}

type Props = {
  list: List;
  devices: Device[];
  onDelete: () => void;
  onSave: (list: List) => void;
};

export default function ({list, onDelete, onSave, devices}: Props) {
  const [dirty, setDirty] = useState(false);
  const [emoji, setEmoji] = useState<string>(null);
  const [products, setProducts] = useState<ProductT[]>([]);
  useEffect(() => {
    setProducts([
      generateRow(list.product1, list.price1),
      generateRow(list.product2, list.price2),
      generateRow(list.product3, list.price3),
      generateRow(list.product4, list.price4),
      generateRow(list.product5, list.price5),
      generateRow(list.product6, list.price6),
      generateRow(list.product7, list.price7),
      generateRow(list.product8, list.price8),
      generateRow(list.product9, list.price9),
    ]);
    setDirty(false);
    setEmoji(list.emoji);
  }, [list]);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }
      const items = reorder<ProductT>(
        products,
        result.source.index,
        result.destination.index,
      );
      setProducts(items);
      setDirty(true);
    },
    [products],
  );

  const onProductChange = useCallback(
    (i: number, newProduct: Partial<ProductT>) => {
      const newProducts = [...products];
      newProducts.splice(i, 1, {...products[i], ...newProduct});
      setProducts(newProducts);
      setDirty(true);
    },
    [setProducts, setDirty, products],
  );

  const onEmojiChange = useCallback((emoji: string) => {
    setEmoji(emoji);
    setDirty(true);
  }, []);

  return (
    <Card
      className={styles.root}
      size="small"
      actions={[
        <Button
          icon={<CheckCircleOutlined />}
          type="link"
          disabled={!dirty}
          onClick={() =>
            onSave({
              name: list.name,
              emoji,
              price1: products[0].price,
              price2: products[1].price,
              price3: products[2].price,
              price4: products[3].price,
              price5: products[4].price,
              price6: products[5].price,
              price7: products[6].price,
              price8: products[7].price,
              price9: products[8].price,
              product1: products[0].name,
              product2: products[1].name,
              product3: products[2].name,
              product4: products[3].name,
              product5: products[4].name,
              product6: products[5].name,
              product7: products[6].name,
              product8: products[7].name,
              product9: products[8].name,
            })
          }
        >
          Speichern
        </Button>,
        <Button icon={<DeleteOutlined />} type="link" danger onClick={onDelete}>
          Löschen
        </Button>,
      ]}
    >
      <Card.Meta
        avatar={<EmojiPicker value={emoji} onChange={onEmojiChange} />}
        title={list.name}
        description={`verwendet auf ${(devices || []).reduce(
          (acc, cv) => acc + (cv.listName === list.name ? 1 : 0),
          0,
        )} Geräten`}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {products.map((product, i) => (
                <Draggable key={product.id} draggableId={product.id} index={i}>
                  {(provided) => (
                    <ProductRow
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      index={i + 1}
                      product={product.name}
                      price={product.price}
                      onChange={onProductChange}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  );
}
