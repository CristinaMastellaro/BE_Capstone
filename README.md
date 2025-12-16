[//]: # (# BE_Capstone)

## Progetto Capstone

# Muse, insipiration for a musical odyssey

L'applicazione **Muse** è nata dal desiderio di ampliare i propri orizzonti musicali, utilizzando varie tecniche per
scoprire nuove canzoni. I criteri utilizzati sono l'**umore** (mood), il **paese** (country) e il **periodo** (period).
Inoltre, è possibile cercare le singole canzoni attraverso una particolare modalità, **Discovery**, che dà la
possibilità
anche ai brani meno conosciuti di
apparire come primo risultato di una ricerca.

## Tutte le funzionalità

* Ricerca di musica in base all'umore
* Scoperta delle top songs settimanali dei singoli paesi
* Scoperta delle canzoni più famose nei decenni tra il 1920 e il 2000
* Ricerca delle singole canzoni in due modalità:
    * "Normale": i risultati si basano sulle canzoni più ricercate e ascoltate
    * "Discovery": i risultati non dipendono dalla popolarità del brano
* Salvataggio le canzoni preferite
* Aggiunta e rimozione di canzoni dalle playlist
* Eliminazione e rinomina delle playlist
* Ascolto delle preview delle canzoni attraverso un player musicale funzionante, ovvero che permette di:
    - regolare il volume secondo le proprie esigenze
    - avanzare o retrocedere nell'ascolto della traccia
    - salvare la canzone corrente in una playlist o tra i preferiti
    - passare al brano successivo o precedente
    - attivare la ripetizione di una canzone
    - ascoltare la playlist in modalità casuale
* Registrazione all'applicazione, con conferma attraverso email
* Modifica dei propri dati utenti e della password

## Tecnologie utilizzate

### Front-end

- React
- TypeScript
- Bootstrap
- Sass
- React Router DOM
- React Redux
- Libreria jsvectormap

### Back-end

- Java
- Spring Boot
- Spring Data JPA / Hibernate
- Spring Security + JWT
- PostgreSQL
- Cloudinary

### API esterne

- Last.fm
- Strive-school

## Utilizzo dell'applicazione scaricandola da GitHub

Se si desidera scaricare l'applicazione in locale e utilizzarla, sarà necessario aggiungere il file **env.properties**,
con i
seguenti parametri:

```
# Per connettere il database PostgreSQL:
PG_URL
PG_USERNAME
PG_PASSWORD

# Per criptare le password (16 caratteri alfanumerici casuali):
JWT_SECRET

#Per le comunicazioni tramite mail:
JTOKEN 
# Il JToken si ottiene andando su myaccount.google.com > Sicurezza > abilitazione verifica in due passaggi. Poi cerca Password per le app > App > Mail, Dispositivo > Altro > Genera > copia la password di 16 caratteri che appare
MAIL 
# Mail di Google utilizzata per ottenere il token

# Per la configurazione di Cloudinary (sarà necessario avere un account Cloudinary):
CLOUDINARY_NAME
CLOUDINARY_KEY
CLOUDINARY_SECRET

# Per la ricerca musicale (sarà necessario avere un account Last.fm for developers):
LAT_FM_API_KEY
```
