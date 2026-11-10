import { useState } from 'react';
import { Text, View } from 'react-native';
import { AssistantEditor, Field, FontPicker, PalettePicker } from '@/components/Personalize';
import { Button, Screen, Txt, useTheme } from '@/components/ui';
import { useStore } from '@/lib/store';

const STEPS = 4;

export default function Onboarding() {
  const { state, update } = useStore();
  const { c } = useTheme();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(state.profile.name);

  const next = () => setStep((s) => Math.min(s + 1, STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 24 }} accessibilityLabel={`Passo ${step + 1} de ${STEPS}`}>
        {Array.from({ length: STEPS }).map((_, i) => (
          <View key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= step ? c.primary : c.border }} />
        ))}
      </View>

      {step === 0 && (
        <View style={{ gap: 18, alignItems: 'center', paddingTop: 24 }}>
          <Text style={{ fontSize: 88 }}>👗</Text>
          <Txt variant="display" style={{ textAlign: 'center' }} color={c.primary}>
            Pearl Closet
          </Txt>
          <Txt style={{ textAlign: 'center', maxWidth: 320 }}>
            Seu closet mágico: guarde suas roupas, crie looks para cada ocasião e converse com sua ajudante de moda.
          </Txt>
          <View style={{ gap: 18, width: '100%', marginTop: 12 }}>
            <Field label="Como você se chama?" value={name} onChangeText={setName} placeholder="Seu nome ou apelido" />
            <Button
              label="Começar"
              icon="sparkles"
              disabled={!name.trim()}
              onPress={() => {
                update({ profile: { name: name.trim() } });
                next();
              }}
            />
          </View>
        </View>
      )}

      {step === 1 && (
        <View style={{ gap: 24 }}>
          <View style={{ gap: 6 }}>
            <Txt variant="title">Deixe o app com a sua cara, {state.profile.name}!</Txt>
            <Txt variant="caption">Você pode mudar isso quando quiser.</Txt>
          </View>
          <PalettePicker />
          <FontPicker />
          <Nav onBack={back} onNext={next} />
        </View>
      )}

      {step === 2 && (
        <View style={{ gap: 24 }}>
          <View style={{ gap: 6 }}>
            <Txt variant="title">Crie sua ajudante de moda</Txt>
            <Txt variant="caption">Escolha o nome, a carinha e a voz dela.</Txt>
          </View>
          <AssistantEditor />
          <Nav onBack={back} onNext={next} disabled={!state.assistant.name.trim()} />
        </View>
      )}

      {step === 3 && (
        <View style={{ gap: 18, alignItems: 'center', paddingTop: 24 }}>
          <Text style={{ fontSize: 88 }}>{state.assistant.avatar}</Text>
          <Txt variant="title" style={{ textAlign: 'center' }}>
            Prontinho!
          </Txt>
          <Txt style={{ textAlign: 'center', maxWidth: 320 }}>
            Oi, {state.profile.name}! Eu sou a {state.assistant.name}. Adicione suas roupas no Closet e eu monto looks
            incríveis para você. 💖
          </Txt>
          <Txt variant="caption" style={{ textAlign: 'center', maxWidth: 320 }}>
            🔒 Suas fotos e roupas ficam guardadas só neste aparelho.
          </Txt>
          <View style={{ width: '100%', gap: 10, marginTop: 8 }}>
            <Button label="Entrar no meu closet" icon="heart" onPress={() => update({ onboarded: true })} />
            <Button label="Voltar" kind="ghost" onPress={back} />
          </View>
        </View>
      )}
    </Screen>
  );
}

function Nav({ onBack, onNext, disabled }: { onBack: () => void; onNext: () => void; disabled?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
      <Button label="Voltar" kind="ghost" onPress={onBack} style={{ flex: 1 }} />
      <Button label="Continuar" onPress={onNext} disabled={disabled} style={{ flex: 2 }} />
    </View>
  );
}
