import { Platform, View } from 'react-native';
import { Alert } from 'react-native';
import { AssistantEditor, Field, FontPicker, PalettePicker } from '@/components/Personalize';
import { Button, Card, Screen, Txt } from '@/components/ui';
import { useStore } from '@/lib/store';

export default function Settings() {
  const { state, update, resetAll } = useStore();

  const reset = () => {
    const msg = 'Isso apaga todas as roupas, looks e conversas deste aparelho.';
    if (Platform.OS === 'web') {
      if (window.confirm(msg)) resetAll();
    } else {
      Alert.alert('Apagar tudo?', msg, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar tudo', style: 'destructive', onPress: resetAll },
      ]);
    }
  };

  return (
    <Screen edges={['bottom']}>
      <View style={{ gap: 20 }}>
        <Card style={{ gap: 20 }}>
          <Txt variant="h2">🎨 Aparência</Txt>
          <PalettePicker />
          <FontPicker />
        </Card>
        <Card style={{ gap: 16 }}>
          <Txt variant="h2">🙋‍♀️ Você</Txt>
          <Field
            label="Seu nome"
            value={state.profile.name}
            onChangeText={(name) => update({ profile: { name } })}
          />
        </Card>
        <Card style={{ gap: 16 }}>
          <Txt variant="h2">{state.assistant.avatar} Sua ajudante</Txt>
          <AssistantEditor />
        </Card>
        <Card style={{ gap: 10 }}>
          <Txt variant="h2">🔒 Privacidade</Txt>
          <Txt variant="caption">
            Tudo fica guardado só neste aparelho: fotos, roupas, looks e conversas. Nada é enviado para a internet.
          </Txt>
          <Button label="Apagar todos os meus dados" icon="trash-outline" kind="ghost" onPress={reset} />
        </Card>
      </View>
    </Screen>
  );
}
