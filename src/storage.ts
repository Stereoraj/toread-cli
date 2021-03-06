import * as fs from "fs";

import {Article} from "./article";

interface FileStructure{
    articles: Article[];
    index:number;
}

export class Storage{

    prepareDB(){
        if(!fs.existsSync("file.json")){
            let file : FileStructure = {articles: [], index: 0}
            fs.writeFileSync("file.json", JSON.stringify(file));
        }
    }

    getArticles(): Article[] {
        this.prepareDB();

        let file:FileStructure = JSON.parse(fs.readFileSync("file.json", "utf8"));
        return file.articles;
    }

    getArticle(id:number): Article | undefined {
        this.prepareDB();

        let file:FileStructure = JSON.parse(fs.readFileSync("file.json", "utf8"));
        return file.articles.find(a => a.id == id);
    }

    saveArticle(article: Article): Article{
        this.prepareDB();
        
        let file:FileStructure = JSON.parse(fs.readFileSync("file.json", "utf8"));
        file.index += 1;
        article.id = file.index;
        file.articles.push(article);
        fs.writeFileSync("file.json", JSON.stringify(file));

        return article;
    }

    updateArticle(article:Article, addTags:boolean): Article | undefined{
        this.prepareDB();

        let file:FileStructure = JSON.parse(fs.readFileSync("file.json", "utf8"));
        let existentArticle:Article | undefined = file.articles.find(a => a.id === article.id);
        if(existentArticle){
            file.articles = file.articles.filter(a => a.id !== article.id);

            if(article.description)
                existentArticle.description = article.description;
            if(article.tags){
                if(existentArticle.tags){
                    if(addTags){
                        for (const tag of article.tags) {
                            existentArticle.tags.push(tag);
                        }
                    } else {
                        for (const tag of article.tags) {
                            existentArticle.tags = existentArticle.tags.filter((value, index, arr) => {
                                return value !== tag;
                            });
                        }
                    }
                } else {
                    if(addTags){
                        existentArticle.tags = [];
                        for (const tag of article.tags) {
                            existentArticle.tags.push(tag);
                        }
                    }
                }
            }
                
            file.articles.push(existentArticle);
            fs.writeFileSync("file.json", JSON.stringify(file));
        } else {
            return undefined;
        }
    }

    deleteArticle(id:number): boolean{
        
        this.prepareDB();

        let file:FileStructure = JSON.parse(fs.readFileSync("file.json", "utf8"));
        
        let updatedArticleArray:Article[] = file.articles.filter(a => a.id != id);

        if(file.articles.length > updatedArticleArray.length){
            file.articles = updatedArticleArray;
            fs.writeFileSync("file.json", JSON.stringify(file));
            return true;
        } else {
            return false;
        }
    }
}
