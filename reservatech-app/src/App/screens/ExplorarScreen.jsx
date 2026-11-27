import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import ErrorBox from "../components/ErrorBox";
import LabeledInput from "../components/LabeledInput";
import RestauranteCard from "../components/RestauranteCard";
import ScreenContainer from "../components/ScreenContainer";
import ScreenHeader, { HeaderIconButton } from "../components/ScreenHeader";
import { ROUTES } from "../routes/routes";
import { getRestaurantes } from "../services/api";
import colors from "../theme/colors";
import { addDaysISO, formatDateBR, parseDateBR, parseTime, todayISO } from "../utils/datetime";
import { maskDate, maskTime } from "../utils/masks";

// US02 - busca de restaurantes por localização, data, horário e número de pessoas.
export default function ExplorarScreen() {
  const navigation = useNavigation();

  const [cidade, setCidade] = useState("");
  const [data, setData] = useState(formatDateBR(addDaysISO(todayISO(), 1)));
  const [horario, setHorario] = useState("19:30");
  const [pessoas, setPessoas] = useState("2");
  const [fieldErrors, setFieldErrors] = useState({});

  const [restaurantes, setRestaurantes] = useState([]);
  const [filtro, setFiltro] = useState(null); // filtros usados na última busca com disponibilidade
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lista todos os restaurantes (ou só os da cidade) sem filtrar por disponibilidade.
  const listarTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRestaurantes(await getRestaurantes({ cidade: cidade.trim() }));
      setFiltro(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [cidade]);

  // Na primeira vez que a tela abre, mostra todos os restaurantes.
  useEffect(() => {
    listarTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function buscarMesas() {
    const errors = {};
    const dataISO = parseDateBR(data);
    const horaOk = parseTime(horario);
    const qtd = Number(pessoas);

    if (!dataISO) errors.data = "Use dd/mm/aaaa.";
    else if (dataISO < todayISO()) errors.data = "Escolha hoje ou depois.";
    if (!horaOk) errors.horario = "Use hh:mm.";
    if (!Number.isInteger(qtd) || qtd <= 0) errors.pessoas = "Informe.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError(null);
    try {
      const lista = await getRestaurantes({
        cidade: cidade.trim(),
        data: dataISO,
        horario: horaOk,
        pessoas: qtd,
      });
      setRestaurantes(lista);
      setFiltro({ data: dataISO, horario: horaOk, pessoas: qtd });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reservar(restaurante) {
    navigation.navigate(ROUTES.NOVA_RESERVA, { restaurante, ...(filtro ?? {}) });
  }

  return (
    <ScreenContainer scroll={false}>
      <ScreenHeader
        title="Explorar"
        subtitle="Encontre uma mesa livre perto de você"
        right={
          <HeaderIconButton
            icon="refresh"
            label="Listar todos os restaurantes"
            disabled={loading}
            onPress={listarTodos}
          />
        }
      />

      <FlatList
        data={restaurantes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RestauranteCard restaurante={item} onReservar={() => reservar(item)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View>
            <LabeledInput
              label="Localização"
              placeholder="Cidade (ex.: São Paulo)"
              value={cidade}
              onChangeText={setCidade}
              returnKeyType="next"
            />
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <LabeledInput
                  label="Data"
                  placeholder="dd/mm/aaaa"
                  value={data}
                  onChangeText={(text) => setData(maskDate(text))}
                  error={fieldErrors.data}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
              <View style={styles.rowItem}>
                <LabeledInput
                  label="Horário"
                  placeholder="hh:mm"
                  value={horario}
                  onChangeText={(text) => setHorario(maskTime(text))}
                  error={fieldErrors.horario}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={styles.rowItemSmall}>
                <LabeledInput
                  label="Pessoas"
                  placeholder="2"
                  value={pessoas}
                  onChangeText={(text) => setPessoas(text.replace(/\D/g, "").slice(0, 2))}
                  error={fieldErrors.pessoas}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <Button textButton="Buscar mesas" loading={loading} onPress={buscarMesas} style={styles.searchButton} />

            <ErrorBox message={error} onRetry={listarTodos} loading={loading} />

            {restaurantes.length > 0 ? (
              <Text style={styles.count}>
                {filtro
                  ? `${restaurantes.length} restaurante(s) com mesa livre em ${formatDateBR(filtro.data)} às ${filtro.horario}`
                  : `${restaurantes.length} restaurante(s) cadastrado(s)`}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : error ? null : (
            <EmptyState
              title="Nenhum restaurante encontrado"
              hint="Tente outro horário, outra data ou outra cidade."
            />
          )
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  rowItem: { flex: 1 },
  rowItemSmall: { width: 76 },
  searchButton: { marginHorizontal: 0 },
  count: { marginTop: 12, marginBottom: 12, fontSize: 14, color: colors.textSecondary },
  separator: { height: 12 },
  centered: { alignItems: "center", justifyContent: "center", paddingVertical: 48 },
  listContent: { flexGrow: 1, paddingBottom: 32 },
});
