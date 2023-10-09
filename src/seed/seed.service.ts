import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Document, Model } from 'mongoose';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {



  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly axiosAdapterService: AxiosAdapter,
  ) {

  }

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.axiosAdapterService.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=10");

    const pokemonToInsert: { name: string, numero: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split("/");
      const numero: number = +segments[segments.length - 2];

      pokemonToInsert.push({ name, numero });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return "SEED Execute";
  }

}
