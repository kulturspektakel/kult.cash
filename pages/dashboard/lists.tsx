import {Col, Row, Modal, PageHeader, Button, Input, Spin, Empty} from 'antd';
import App from '../../components/App';
import ProductList from '../../components/ProductList';
import {ListUpdateInput, List, Device} from '@prisma/client';
import {useState, useCallback} from 'react';
import {GetServerSideProps} from 'next';
import {getInitialLists, getInitialDevices} from '../../utils/initialProps';
import {useLists, useDevices} from '../../components/useData';

export default function Lists({
  initialLists,
  initialDevices,
}: {
  initialLists?: List[];
  initialDevices?: Device[];
}) {
  const {deleteItem, updateItem, createItem} = useLists(initialLists);
  const {items: lists} = useLists(initialLists);
  const {items: devices} = useDevices(initialDevices);
  const [modal, contextHolder] = Modal.useModal();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newListName, setNewListName] = useState<string | null>(null);

  const onCreateList = useCallback(async () => {
    if (!newListName) {
      return;
    }
    await createItem({
      name: newListName,
    });
    setNewListName(null);
    setCreateModalVisible(false);
  }, [newListName, createItem]);

  return (
    <App>
      {contextHolder}
      <Modal
        title="Neue Preisliste erstellen"
        visible={createModalVisible}
        okText="Erstellen"
        cancelText="Abbrechen"
        onCancel={() => setCreateModalVisible(false)}
        okButtonProps={{disabled: !newListName, onClick: onCreateList}}
      >
        <Input
          placeholder="Name"
          autoFocus
          value={newListName ?? ''}
          onChange={(e) => setNewListName(e.target.value)}
        />
      </Modal>
      <PageHeader
        title="Preislisten"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            Neue Preisliste
          </Button>,
        ]}
      >
        {lists?.length === 0 && <Empty description="Keine Preislisten" />}
        {lists ? (
          <Row gutter={16}>
            {lists.map((list) => (
              <Col sm={24} md={12} lg={8} xxl={6} key={list.name}>
                <ProductList
                  list={list}
                  devices={devices ?? []}
                  onSave={(list: ListUpdateInput) => updateItem(list)}
                  onDelete={() =>
                    modal.confirm({
                      title: 'Preisliste löschen',
                      content: `Soll die Preisliste "${list.name}" von allen Geräten gelöscht werden?`,
                      cancelText: 'Abbrechen',
                      okType: 'danger',
                      okText: 'Löschen',
                      onOk: () => {
                        deleteItem(list.name);
                      },
                    })
                  }
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: 50,
            }}
          >
            <Spin size="large" />
          </div>
        )}
      </PageHeader>
    </App>
  );
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const [initialLists, initialDevices] = await Promise.all([
    getInitialLists(req),
    getInitialDevices(req),
  ]);
  return {
    props: {initialLists, initialDevices},
  };
};
