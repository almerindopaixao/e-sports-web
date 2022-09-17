import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import axios from 'axios';
import { Check, GameController } from 'phosphor-react';
import { FormEvent, useEffect, useState } from 'react';

import { Input } from '../patterns/Form/Input';

interface Game {
    id: string;
    title: string;
}

export function CreateAdModal() {
    const weekDaysOptions = [
        { name: 'D', description: 'Domingo', value: '0' },
        { name: 'S', description: 'Segunda', value: '1' },
        { name: 'T', description: 'Terça', value: '2' },
        { name: 'Q', description: 'Quarta', value: '3' },
        { name: 'Q', description: 'Quinta', value: '4' },
        { name: 'S', description: 'Sexta', value: '5' },
        { name: 'S', description: 'Sábado', value: '6' },
    ]

    const [games, setGames] = useState<Game[]>([]);
    const [weekDays, setWeekDays] = useState<string[]>([]);
    const [useVoiceChannel, setUseVoiceChannel] = useState<boolean>(false);


    useEffect(() => {
        axios('http://localhost:3000/games').then(({ data }) => setGames(data));
    }, []);

    async function handleCreateAd(event: FormEvent) {
        event.preventDefault();
        console.log(event);

        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData);

        if (!data.name) return;

        try {
            axios.post(`http://localhost:3000/games/${data.game}/ads`, {
                name: data.name,
                yearsPlaying: Number(data.yearsPlaying),
                discord: data.discord,
                weekDays: weekDays.map(Number),
                hourStart: data.hourStart,
                hourEnd: data.hourEnd,
                useVoiceChannel: useVoiceChannel
            });

            alert('Anúncio criado com sucesso!');
        } catch (err) {
            console.log(err);
            alert('Erro ao criar o anúncio!')
        }

    }

    return (
        <Dialog.Portal>
          <Dialog.Overlay className='bg-black/60 inset-0 fixed' />
          
          <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25'>
            <Dialog.Title className='text-3xl font-black'>Publique um anúncio</Dialog.Title>

            <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='font-semibold' htmlFor='game'>Qual o game?</label>
                <select
                  id='game'
                  name='game'
                  className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none'
                  defaultValue=''
                >
                    <option disabled value=''>Selecione o game que deseja jogar</option>

                    {games.map((game) => <option key={game.id} value={game.id}>{game.title}</option>)}
                </select>
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor='name'>Seu nome (ou nickname)</label>
                <Input 
                  id='name'
                  name='name'
                  type='text' 
                  placeholder='Como te chamam dentro do game?' 
                />
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div className='flex flex-col gap-2'>
                  <label htmlFor='yearsPlaying'>Joga há quantos anos?</label>
                  <Input id='yearsPlaying' name='yearsPlaying' type='number' min={0} placeholder='Tudo bem ser ZERO'/>
                </div>
                <div className='flex flex-col gap-2'>
                  <label htmlFor='discord'>Qual seu Discord?</label>
                  <Input id='discord' name='discord' type='text' placeholder='Usuario#0000' />
                </div>
              </div>

              <div className='flex gap-6'>
                <div className='flex flex-col gap-2'>
                  <label htmlFor="weekDays">Quando costuma jogar?</label>

                  <ToggleGroup.Root 
                    className='grid grid-cols-4 gap-2' 
                    type='multiple'
                    value={weekDays}
                    onValueChange={setWeekDays}
                >
                        {weekDaysOptions.map((weekDayOption, index) => (
                            <ToggleGroup.Item 
                                key={index}
                                value={weekDayOption.value}
                                title={weekDayOption.description}
                                className={`w-8 h-8 rounded ${weekDays.includes(weekDayOption.value) ? 'bg-violet-500' : 'bg-zinc-900'}`}
                            >
                                {weekDayOption.name}
                            </ToggleGroup.Item>
                        ))}
                   </ToggleGroup.Root>
                </div>
                <div className='flex flex-col gap-2 flex-1'>
                  <label htmlFor="hourStart">Qual horário do dia?</label>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input id='hourStart' name='hourStart' type="time" placeholder='De'  />
                    <Input id='hourEnd' name='hourEnd' type="time" placeholder='Até'  />
                  </div>
                </div>
              </div>

              <label className='mt-2 flex items-center gap-2'>
                <Checkbox.Root 
                    checked={useVoiceChannel}
                    onCheckedChange={(checked) => {
                        if (checked === true) {
                            setUseVoiceChannel(true);
                        } else {
                            setUseVoiceChannel(false);
                        }
                    }}
                    className='w-6 h-6 p-1 rounded bg-zinc-900'
                >
                    <Checkbox.Indicator>
                        <Check className='w-4 h-4 text-emerald-400' />    
                    </Checkbox.Indicator>
                </Checkbox.Root>
                <span className='text-sm'>Costumo me conectar ao chat de voz</span>
              </label>

              <footer className='mt-4 flex justify-end gap-4'>
                <Dialog.Close 
                  className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'
                >
                  Cancelar
                </Dialog.Close>

                <button 
                  type='submit' 
                  className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'
                >
                  <GameController size={24} />
                  <span>Encontrar duo</span>
                </button>
              </footer>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
    )
}