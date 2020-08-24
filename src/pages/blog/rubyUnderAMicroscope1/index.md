---
title: 'Notes on "Ruby Under A Microscope" and more: Intro. & Tokenization'
date: '2020-05-17'
---

I've spent a good part of the past two years working on JavaScript-heavy codebases on the client-side of commercial applications and hobbyist projects but about eight months ago, I had made a rather smooth transition to server-side engineering. I currently work nearly entirely with the Ruby on Rails web framework (occasionally with Sinatra) which pushed me into learning its technicalities at greater depth. However, what I had observed was that my learning was more in the style of "first Rails, then Ruby". Interestingly, I had realized that I wasn't the only one. The [ruby-lang.org/about](https://www.ruby-lang.org/en/about/) page itself says, _"Much of the growth is attributed to the popularity of software written in Ruby, particularly the Ruby on Rails web framework."_

With the _Ruby without Rails_ movement gaining momentum lately, I've been intrigued not only by the possibilities of using Ruby to build web applications without Rails but also by the nuances of Ruby's internals. This curiosity lead me to find "Ruby Under A Microscope" by Pat Shaughnessy and attempt to study it. I hope to serialize my study notes as posts covering sizable chunks of content from the book every week. These posts will not just be summarized versions of chapters but rather documented experiences of my poking around parts of the Ruby Language's source (available on GitHub) and trying to make sense of it.

## _Flavors_ of Ruby

While Ruby, in its official distribution today, uses YARV (for ruby versions `< 1.9`), Ruby does have implementations that utilize other compiler backends:

- **JRuby** is Ruby atop the JVM (Java Virtual Machine), utilizing the JVM’s optimizing JIT compilers, garbage collectors, concurrent threads, tool ecosystem, and vast collection of libraries.
- **Rubinius** is ‘Ruby written in Ruby’. Built on top of LLVM, Rubinius sports a nifty virtual machine that other languages are - being built on top of, too.
- **TruffleRuby** is a high performance Ruby implementation on top of GraalVM.
- **mruby** is a lightweight implementation of the Ruby language that can be linked and embedded within an application. Its development is led by Ruby’s creator Yukihiro “Matz” Matsumoto.
- **IronRuby** is an implementation “tightly integrated with the .NET Framework”.
- **MagLev** is “a fast, stable, Ruby implementation with integrated object persistence and distributed shared cache”.
- **Cardinal** is a “Ruby compiler for Parrot Virtual Machine” (Perl 6).

## Ruby Implementations : A Little Bit of History

MRI (Matz's Ruby Interpreter), which was also known as CRuby and named after Ruby's creator Yukihiro “Matz” Matsumoto, was the _de facto_ reference implementation of the Ruby Programming Language until Ruby 1.9 when the attempt to create a specification (RubySpec) failed. MRI was a pure interpreter which in simple terms: ingested Ruby code; tokenized; created an Abstract Syntax Tree (AST), as a consequence of parsing and then executed Ruby's C code.

Digressing to the _Global Interpreter Lock (GIL)_, which cannot go unmentioned when talking of MRI because of its criticism for the way concurrency was handled in a time when multi-core processors and implementations of true multi-threading became a necessity. But I'd suppose concurrency in Ruby would require a post of its own.

The book has a focus primarily on this implementation of Ruby while _Chapter 3_ on compilation gets into the details of _YARV / RubyVM_ which is the official distribution of Ruby today.

### The RubySpec project

The official [ruby/spec](https://github.com/ruby/spec) is a test suite for the behavior of the Ruby programming language. As stated on its official GitHub page, it is not ISO standardized and does not seek standardization of that kind but instead just is a practical tool to test the behaviour of Ruby with code. These tests are written in the style of RSpec 2 but are run with MSpec and describe - _language syntax, core library, the standard library, the C API for extensions and the command line flags_.
The RubySpec tests were initially created in 2006 for the Rubinius project.

## Tokenization

A standard Ruby program (ruby version > 1.9) would undergo three transforms before it is run:

1. Tokenization --> Tokens
2. Parsing --> Abstract Synatax Tree nodes
3. Compilation --> YARV instructions

Clearly, this excludes the transforms taking place after YARV instructions are generated.

_Tokenization_, simply takes the Ruby code of a _.rb_ file and converts it into a series of tokens ie. words from the Ruby programming language that it understands and identifiers, by iterating through characters. In fact, Ruby's C source, loops through each character and processes it based on what it is. Although it might seem that three steps listed earlier are sequential, tokenization and parsing happen at the same time; the parsing engine calls the tokenizer to retrieve tokens.

Consider the first line of the given snippet --

```
    50.times do |n|
        puts "bitwise ${n}"
    end
```

As it iteratively loops through `5`, it realizes that it's at the start of a number and continues over to the `0` until it encounters its first non-numeric character. It then sees a `.` which actually is a numeric character, given that it could be part of a floating-point value. When it encounters `t`, a non-numeric character, it backtracks to the `.` and converts the `50` it saw into a token of type `tINTEGER`. It continues this process sequentially through the line, converting `times` to a token - `tIDENTIFIER`, `do` to a token - `keyword_do`, `n` to a token `tIDENTIFIER`. In a similar way, the entire script which is a character stream yields a token stream.

```
tINTEGER.tIDENTIFIER keyword_do | tIDENTIFIER |
```

It is presumed that the distinctions between keywords, reserved words and identifiers are understood by the reader. Internally, Ruby's C source maintains a table of these reserved words.

A list of Ruby's keywords are defined at [defs/keywords](https://github.com/ruby/ruby/blob/master/defs/keywords).

## Grammars, Rules and the Significance of _`parser.y`_

The [`parser.y`](https://github.com/ruby/ruby/blob/master/parse.y) file is a grammar rule file which contains the rules for the Ruby parser engine. This file is massive (13,315 LOC) and if you're familiar with C programming, you'd know it ought to have pointers and `structs` flying around all over. Considering our interest in tokenization specifically, the `parser_yylex` function should be within our purview (starts at line 8,888 _as of 17th May 2020_).

The function prototype:

```
    static enum
        yytokentype parser_yylex(struct parser_params *p);
```

Observe the switch statement

```
   retry:
    last_state = p->lex.state;
#ifndef RIPPER
    token_flush(p);
#endif
    switch (c = nextc(p)) {
        /*
            contains cases for characters that may be
            encountered while iterating through the
            character stream while jumping to the
            'retry' label everytime a whitespace
            character is encountered
        */
        ...
    }
```

The `nextc()` calls, as you would expect, return the next character in the stream.

Another detail quoted straight from the book --

_Ruby doesn’t use the Lex tokenization tool that C programmers commonly use in conjunction with a parser generator like Yacc or Bison . Instead, the Ruby core team wrote the Ruby tokenization code by hand, whether for performance reasons or because Ruby’s tokenization rules required special logic that Lex couldn’t provide._

## Tokenizing with _Ripper_

It is quite a simple task to see tokenization in action. All that needs to be done is to require the `Ripper` class and pass to its `lex()` method a string containing the code as an argument.

```
    require 'ripper'
    require 'pp'

    source = <<STR
        50.times do |n|
            puts "bitwise ${n}"
        end
    STR

    pp Ripper.lex(source)
```

### The tokenized output --

```
[[[1, 0], :on_sp, "\t", EXPR_BEG],
 [[1, 1], :on_int, "50", EXPR_END],
 [[1, 3], :on_period, ".", EXPR_DOT],
 [[1, 4], :on_ident, "times", EXPR_ARG],
 [[1, 9], :on_sp, " ", EXPR_ARG],
 [[1, 10], :on_kw, "do", EXPR_BEG],
 [[1, 12], :on_sp, " ", EXPR_BEG],
 [[1, 13], :on_op, "|", EXPR_BEG|EXPR_LABEL],
 [[1, 14], :on_ident, "n", EXPR_ARG],
 [[1, 15], :on_op, "|", EXPR_BEG|EXPR_LABEL],
 [[1, 16], :on_ignored_nl, "\n", EXPR_BEG|EXPR_LABEL],
 [[2, 0], :on_sp, "\t\t", EXPR_BEG|EXPR_LABEL],
 [[2, 2], :on_ident, "puts", EXPR_CMDARG],
 [[2, 6], :on_sp, " ", EXPR_CMDARG],
 [[2, 7], :on_tstring_beg, "\"", EXPR_CMDARG],
 [[2, 8], :on_tstring_content, "bitwise ${n}", EXPR_CMDARG],
 [[2, 20], :on_tstring_end, "\"", EXPR_END],
 [[2, 21], :on_nl, "\n", EXPR_BEG],
 [[3, 0], :on_sp, "\t", EXPR_BEG],
 [[3, 1], :on_kw, "end", EXPR_END],
 [[3, 4], :on_nl, "\n", EXPR_BEG]]

```

**Each element in the output array consists of an array with 4 elements:**

1. `[line_number, text_column_number]`
2. `:the_token_type` as a Ruby Symbol _eg: `:on_nl, :on_kw`_
3. The character(s) corresponding to the token _eg: `"\n", "end"`_
4. The _state_ of the tokenizer as it iterates _eg: `EXPR_BEG, EXPR_CMDARG`_ (defined in the `Ripper` Class)

### Some key aspects of tokenization:

- Lookahead is utilized to ensure a distinction, for instance, between **`<`**, less than operator and **`<<`**, the shovel operator

- Tokenization **DOES NOT** detect syntax errors; that is a responsibility of the parser.

Read more about [Ripper](https://ruby-doc.org/stdlib-2.6.3/libdoc/ripper/rdoc/Ripper.html).

#### Stay tuned for the next post which will entail the details of _Parsing_.

#### Buy _"Ruby Under a Microscope"_ on [Amazon](https://www.amazon.com/Ruby-Under-Microscope-Illustrated-Internals-ebook/dp/B00GK5P6L2)!

## References

1. Shaughnessy, P., n.d. Ruby Under A Microscope.

2. Ruby-lang.org. 2020. About Ruby. [online] Available at: [https://www.ruby-lang.org/en/about/](https://www.ruby-lang.org/en/about/) [Accessed 18 May 2020].

3. GitHub. 2020. Ruby/Spec. [online] Available at: [https://github.com/ruby/spec](https://github.com/ruby/spec) [Accessed 18 May 2020].

4. GitHub. 2020. The Ruby Programming Language. [online] Available at: [https://github.com/ruby](https://github.com/ruby) [Accessed 18 May 2020].

5. Ruby-doc.org. 2020. Class: Ripper (Ruby 2.6.3). [online] Available at: [https://ruby-doc.org/stdlib-2.6.3/libdoc/ripper/rdoc/Ripper.html](https://ruby-doc.org/stdlib-2.6.3/libdoc/ripper/rdoc/Ripper.html) [Accessed 18 May 2020].
