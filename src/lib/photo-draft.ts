// Foto escolhida na tela Foto de perfil, à espera do recorte em "Ajustar foto".
// Fica só na memória: uma imagem não cabe (nem deve ir) num parâmetro de rota.

export type PhotoDraft = { uri: string; width: number; height: number };

let draft: PhotoDraft | null = null;

export const photoDraft = {
  get: () => draft,
  set: (photo: PhotoDraft | null) => {
    draft = photo;
  },
};
