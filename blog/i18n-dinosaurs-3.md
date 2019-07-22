# A guide to building a fully international, universal web app.

- [Part One]('https://google.com')
- [Part Two]('https://google.com')

## Part Three of Four

- [Part Four]('https://google.com')

## pre - note

Here at Ginetta we strive to give our users the best possible web experience. We care a lot about performance and we care more about accessability. Our creations are for everyone to enjoy and a huge part of accessability is crossing the language barrier.

### Real Mock Data

Let's add some mock data files to make the application a bit more interesting. In the root create a `data.js` where you can copy and paste the [data you find here](https://github.com/OliWalker/i18n-dinosaurs/blob/master/data.js).

Then we shall create a new component to display the cards on our home screen `components/DinosaurCard.js` with the following code:

```
import { withTranslation,Link } from '../i18n'
import css from '../styles.css';


const DinosaurCard = ({ dinosaur, t }) => {

  return (
    // Let's take the Link out of the index and use it here
    <Link href={{ pathname: '/dinosaur', query: { dinosaur: dinosaur.name } }}>
      <a>
        <div className={css.dinosaurCard}>
          <img src={dinosaur.image} />
          <h2>{t('name',{name: dinosaur.name})}</h2>
          <h3>{t('diet',{diet: dinosaur.diet})}</h3>
        </div>
      </a>
    </Link>
  )
}

export default withTranslation('dinosaurCard')(DinosaurCard)
```

Of course now we must add this new json file for all of the languages, and afterwards, restart the server.

```
{
  "name": "Name: {{name}}",
  "diet": "Diet: {{diet}}"
}
```

Then we import this component into the HomePage and loop over the mock data to present our dinosaur cards under the banner.

```
import DinosaurCard from '../components/DinosaurCard'
...
  <div className={css.dinosaurList}>
    {data.map((dinosaur) => (
      <DinosaurCard dinosaur={dinosaur} key={dinosaur.name}/>
    ))}
  </div>
```

and remember, as stated in [part one](https://google.com), because this is a sub-component we must add this into the `namespaces required` array on the top level page (in this case index.js) to have access to the translations on the initial SSR - otherwise we will have a flash of untranslated content - ew.

```
HomePage.getInitialProps = () => {
  return {
    namespacesRequired: ['homePage, dinosaurCard']
  };
};

export default withTranslation('homePage')(HomePage)
```

Notice that we don't have to pass it to the withTranslation HOC, because we are not using it on this page. If we were to have multiple namespaces on one page we must separate them when using the `t function` by calling `t('homePage:banner')`. We will do this later!

### Making a Flashy Dinosaur Page

Now this is done we can pad out our dinosaur page a bit.

We will create a more interesting page using the mock data, but importantly we shall change the `getInitialProps` function to find the correct dinosaur out of the mock data.

By the end of this transformation our Dinosaur.js should look like:

```
import { withTranslation } from '../i18n';
import Header from '../components/Header';
import data from '../data';
import css from '../styles.css';

const dinosaur = ({ t, dinosaur }) => {
  return (
    <>
      <Header />
      <img src={dinosaur.image} className={css.dinosaurImg} />
      <div className={css.dinosaurContent}>
        <h1>{t('dinosaur:myNameIs', { dinosaur: dinosaur.name })} </h1>
        <div className={css.dinosaurContent}>
					<p>
						<span>{t('dinosaurCard:diet')}:</span>
						{dinosaur.diet}
					</p>
					<p>
						<span>{t('dinosaur:length')}:</span>
						{dinosaur.length}
					</p>
					<p>
						<span>{t('dinosaur:weight')}:</span>
						{dinosaur.weight}
					</p>
        </div>
        <p>{dinosaur.info}</p>
      </div>
    </>
  );
};

dinosaur.getInitialProps = ({ query }) => {
  const { dinosaur } = query;
  const dino = data.find((dino) => dino.name === dinosaur);
  return {
    dinosaur: dino,
    namespacesRequired: ['dinosaur', 'dinosaurCard'],
  };
};

export default withTranslation(['dinosaur', 'dinosaurCard'])(dinosaur);

```

As you can see we have added a few new keys to the `dinosaur.json` so we better add them in to the json too, and, as always, restart the server.

```
  "length": "Length",
  "weight": "Weight"
```

but seeing as we already have the translation for `diet` we can use this from the `dinosaurCard.json`.

Remember when we need two translation json files in one page, we must

1. return both namespaces from `getInitialProps`
2. pass an array containing the namespaces to with HOC
3. whenever we need a translation we need to prefix it with the namespace we are using.

### One More Issue

As I am sure you have noticed, the `info` of the dinosaur is not translated, this is because it is our "mock data" from our "api" and somebody (yeah me) did not translate it all.

Some options here would be to keep the translations in json files on the front end and send slugs as the keys to the json value through the api. Or, send the current language to the API when requesting data, and receive the translated info back.

There are use cases for both, you decide what works best for your application!
