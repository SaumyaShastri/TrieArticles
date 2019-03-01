const fs = require('file-system');
const rs = require('readline-sync');

let companieslist = fs.readFileSync('companies.dat', "utf8");
let companies;
let i = 0;
let j = 0;
let company;
let table = {};
let primarycompany;
let hits = 0;
let temp;
let trie;
let article = '';
let totalwords = 0;
let arr = [];
let output = {};

companieslist = companieslist.split('\n');

class Node
{
    constructor(val, is_end)
    {
        this.val = val;
        this.is_end = is_end;
        this.hit_num = 0;
        this.child = {
            A: null, B: null, C: null, D: null, E: null, F: null, G: null, H: null, I: null, J: null, K: null, L: null, M: null, N: null, O: null, P: null, R: null, S: null, T: null, U: null, V: null, W: null, X: null, Y: null, Z: null,
            a: null, b: null, c: null, d: null, e: null, f: null, g: null, h: null, i: null, j: null, k: null, l: null, m: null, n: null, o: null, p: null, r: null, s: null, t: null, u: null, v: null, w: null, x: null, y: null, z: null,
            ' ': null
        };
    }
}

class Trie
{
    constructor()
    {
        this.root = new Node(null, false);
        this.statistics = {};
        this.frequency = [];
    }
    insert(value)
    {
        let current = this.root;
        let word = '';
        let i;
        let character;
        let newNode;
        if(value.length == 0)
        {
            return;
        }
        for(i = 0; i < value.length; i++)
        {
            character = value.charAt(i);
            word = word + character;
            if (current.child[character] != null) 
            {
                current = current.child[character];
            }
            else 
            {
                if (i == value.length - 1) 
                {
                    newNode = new Node(word, true);
                }
                else 
                {
                    newNode = new Node(word, false);
                }
                current.child[character] = newNode;
                current = current.child[character];
            }
        }
    }
    getFrequency(value)
    {
        let i;
        let j;
        for (i = 0; i < value.length; i++) 
        {
            this.frequency[i] = new Array();
            this.frequency[i].push(this.root);
        }
        for (i = 0; i < value.length; i++) 
        {
            for (j = 0; j < this.frequency[i].length; j++) 
            {
                if (this.frequency[i][j].child[value.charAt(i)] != null) 
                {
                    this.frequency[i][j].child[value.charAt(i)].hit_num++;
                    if (i < value.length - 1) 
                    {
                        this.frequency[i + 1].push(this.frequency[i][j].child[value.charAt(i)]);
                    }
                }
            }
        }
        this.search(this.root);
    }
    getRoot()
    {
        return this.root;
    }
    print()
    {
        console.log(this.root);
    }
    search(node)
    {
        let temp;
        if(node.is_end == true)
        {
            this.statistics[node.val] = node.hit_num;
        }
        for (temp in node.child) 
        {
            if (node.child[temp] != null) 
            {
                this.search(node.child[temp]);
            }
        }
    }
}

for (i = 0; i < companieslist.length; i++) 
{
    companies = companieslist[i].split("\t");
    for (j = 0; j < companies.length; j++) 
    {
        company = companies[j].replace(",", "").replace(".", "").trim();
        if (company.indexOf(companies[0]) != -1 && company != companies[0]) 
        {
            continue;
        }
        else 
        {
            table[company] = companies[0];
        }
    }
}

function isPromptEnd(article) 
{
    for (temp in article) {
        if (article[i] == '.') {
            continue;
        }
        else {
            return false;
        }
    }
    return true;
}

trie = new Trie();

for(temp in table)
{
    trie.insert(temp);
}

while (true) 
{
    article = rs.question('Please enter your article: ');
    if (isPromptEnd(article)) 
    {
        break;
    }
    arr = article.split(" ");
    for (temp in arr) 
    {
        if (arr[temp] === 'a' || arr[temp] === 'an' || arr[temp] === 'the' || arr[temp] === 'and' || arr[temp] === 'or' || arr[temp] === 'but') 
        {
            arr.splice(temp, 1);
        }
    }
    totalwords = totalwords + arr.length;
    trie.getFrequency(article);
    console.log("Company\t\tHit Count\t\tRelevance");
    for (temp in trie.statistics) 
    {
        if (trie.statistics[temp] != 0) 
        {
            if (output[table[temp]] == undefined) 
            {
                output[table[temp]] = trie.statistics[temp];
            }
            else 
            {
                output[table[prop]] += trie.statistics[prop];
            }
        }
    }
    for (primarycompany in output) {
        hits = hits + output[primarycompany];
        console.log(primarycompany + "\t\t" + output[primarycompany] + "\t\t" + Math.round(output[primarycompany] / totalwords * 10000) / 100.00 + "%");
    }
    console.log("Total, " + hits + "\t\t" + Math.round(hits / totalwords * 10000) / 100.00 + "%");
    console.log("Total words: " + totalwords);
}