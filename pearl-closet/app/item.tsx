import * as ImagePicker from 'expo-image-picker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, View } from 'react-native';
import { Field } from '@/components/Personalize';
import { Button, Chip, ItemThumb, Row, Screen, Txt, useTheme } from '@/components/ui';
import { CATEGORIES, COLORS, STYLES } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import type { CategoryKey, ClothingItem, StyleKey } from '@/lib/types';

export default function ItemEditor() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { state, addItem, updateItem, removeItem } = useStore();
  const { c } = useTheme();
  const existing = state.items.find((i) => i.id === id);

  const [name, setName] = useState(existing?.name ?? '');
  const [category, setCategory] = useState<CategoryKey>(existing?.category ?? 'top');
  const [color, setColor] = useState(existing?.color ?? 'rosa');
  const [styles, setStyles] = useState<StyleKey[]>(existing?.styles ?? ['casual']);
  const [warm, setWarm] = useState(existing?.warm ?? false);
  const [photoUri, setPhotoUri] = useState(existing?.photoUri);

  const preview: ClothingItem = {
    id: 'preview',
    name: name || 'Nova peça',
    category,
    color,
    styles,
    warm,
    photoUri,
    createdAt: 0,
  };

  const pickPhoto = async (camera: boolean) => {
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.6 };
    if (camera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return;
    }
    const res = camera ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
    if (!res.canceled && res.assets[0]) setPhotoUri(res.assets[0].uri);
  };

  const toggleStyle = (s: StyleKey) =>
    setStyles((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const canSave = name.trim().length > 0 && styles.length > 0;

  const save = () => {
    const data = { name: name.trim(), category, color, styles, warm, photoUri };
    if (existing) updateItem(existing.id, data);
    else addItem(data);
    router.back();
  };

  const remove = () => {
    if (!existing) return;
    const doIt = () => {
      removeItem(existing.id);
      router.back();
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`Apagar "${existing.name}" do closet?`)) doIt();
    } else {
      Alert.alert('Apagar peça', `Apagar "${existing.name}" do closet?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar peça', style: 'destructive', onPress: doIt },
      ]);
    }
  };

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: existing ? 'Editar peça' : 'Nova peça' }} />
      <View style={{ alignItems: 'center', gap: 12 }}>
        <ItemThumb item={preview} size={150} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {Platform.OS !== 'web' && <Button label="Tirar foto" icon="camera" kind="soft" onPress={() => pickPhoto(true)} />}
          <Button label={photoUri ? 'Trocar foto' : 'Escolher foto'} icon="image" kind="soft" onPress={() => pickPhoto(false)} />
        </View>
        {photoUri && (
          <Pressable onPress={() => setPhotoUri(undefined)} accessibilityRole="button">
            <Txt variant="caption" style={{ textDecorationLine: 'underline' }}>
              Remover foto
            </Txt>
          </Pressable>
        )}
      </View>

      <View style={{ gap: 22, marginTop: 20 }}>
        <Field label="Nome da peça" value={name} onChangeText={setName} placeholder="Ex.: Blusa de laço" maxLength={30} />

        <Section title="Tipo">
          {CATEGORIES.map((cat) => (
            <Chip key={cat.key} label={`${cat.emoji} ${cat.label}`} selected={category === cat.key} onPress={() => setCategory(cat.key)} />
          ))}
        </Section>

        <Section title="Cor principal">
          {COLORS.map((col) => (
            <Chip key={col.key} label={col.label} color={col.hex} selected={color === col.key} onPress={() => setColor(col.key)} />
          ))}
        </Section>

        <Section title="Combina com (escolha um ou mais)">
          {STYLES.map((s) => (
            <Chip key={s.key} label={`${s.emoji} ${s.label}`} selected={styles.includes(s.key)} onPress={() => toggleStyle(s.key)} />
          ))}
        </Section>

        <Section title="É quentinha (boa para o frio)?">
          <Chip label="❄️ Sim, esquenta" selected={warm} onPress={() => setWarm(true)} />
          <Chip label="☀️ Não" selected={!warm} onPress={() => setWarm(false)} />
        </Section>

        <Button label={existing ? 'Salvar alterações' : 'Guardar no closet'} icon="checkmark" onPress={save} disabled={!canSave} />
        {!canSave && (
          <Txt variant="caption" style={{ textAlign: 'center' }}>
            Dê um nome para a peça para poder guardar.
          </Txt>
        )}
        {existing && (
          <Button label="Apagar peça" icon="trash-outline" kind="ghost" onPress={remove} style={{ borderColor: c.border }} />
        )}
      </View>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Txt variant="bold">{title}</Txt>
      <Row>{children}</Row>
    </View>
  );
}
