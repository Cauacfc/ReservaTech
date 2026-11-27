import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import ErrorBox from "../components/ErrorBox";
import MesaCard from "../components/MesaCard";
import ScreenContainer from "../components/ScreenContainer";
import ScreenHeader, { HeaderIconButton } from "../components/ScreenHeader";
import { useRestaurante } from "../contexts/RestauranteContext";
import { ROUTES } from "../routes/routes";
import colors from "../theme/colors";

// US05 - lista, cadastra, altera e exclui as mesas do restaurante.
export default function MesasScreen() {
  const navigation = useNavigation();
  const { restaurante, mesas, loading, error, load, removeMesa } = useRestaurante();

  const [mesaToDelete, setMesaToDelete] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  function askToDelete(mesa) {
    setDeleteError(null);
    setMesaToDelete(mesa);
    setConfirmVisible(true);
  }

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await removeMesa(mesaToDelete.id);
      setConfirmVisible(false);
    } catch (e) {
      // Ex.: "A mesa 2 possui reservas e não pode ser excluída."
      setDeleteError(e.message);
    } finally {
      setDeleting(false);
    }
  }

  const firstLoad = loading && !restaurante;

  return (
    <ScreenContainer scroll={false}>
      <ScreenHeader
        title="Mesas"
        right={
          <>
            <HeaderIconButton icon="refresh" label="Atualizar lista" disabled={loading} onPress={load} />
            {restaurante ? (
              <HeaderIconButton
                icon="add-circle"
                label="Cadastrar mesa"
                onPress={() => navigation.navigate(ROUTES.MESA_FORM)}
              />
            ) : null}
          </>
        }
      />

      <ErrorBox message={error} onRetry={load} loading={loading} />

      {firstLoad ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : !restaurante ? (
        <EmptyState title="Cadastre seu restaurante primeiro">
          <Button
            textButton="Cadastrar restaurante"
            style={styles.emptyButton}
            onPress={() => navigation.navigate(ROUTES.RESTAURANTE_FORM)}
          />
        </EmptyState>
      ) : (
        <FlatList
          data={mesas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <MesaCard
              mesa={item}
              onEdit={() => navigation.navigate(ROUTES.MESA_FORM, { id: item.id })}
              onDelete={() => askToDelete(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            mesas.length > 0 ? (
              <Text style={styles.count}>
                {mesas.length === 1 ? "1 mesa cadastrada" : `${mesas.length} mesas cadastradas`}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            error ? null : (
              <EmptyState
                title="Nenhuma mesa cadastrada"
                hint="Toque no botão + para cadastrar a primeira."
              />
            )
          }
          refreshing={loading}
          onRefresh={load}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ConfirmDialog
        visible={confirmVisible}
        title="Excluir mesa"
        message={`Deseja excluir a mesa ${mesaToDelete?.numero}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyButton: { marginTop: 16, alignSelf: "stretch" },
  count: { marginBottom: 12, fontSize: 14, color: colors.textSecondary },
  separator: { height: 12 },
  listContent: { flexGrow: 1, paddingBottom: 32 },
});
