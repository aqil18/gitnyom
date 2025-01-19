import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
import os

# Load and preprocess text data from git repo files
def load_text_from_repo(repo_path):
    texts = []
    for root, dirs, files in os.walk(repo_path):
        for file in files:
            if file.endswith(".py") or file.endswith(".md"):  # Adjust file types as needed
                with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                    texts.append(f.read())
    return texts

# Tokenize and pad sequences
def preprocess_texts(texts, max_num_words=10000, max_sequence_length=100):
    tokenizer = Tokenizer(num_words=max_num_words)
    tokenizer.fit_on_texts(texts)
    sequences = tokenizer.texts_to_sequences(texts)
    word_index = tokenizer.word_index
    data = pad_sequences(sequences, maxlen=max_sequence_length)
    return data, word_index

# Build the model
def build_model(max_num_words, embedding_dim, max_sequence_length):
    model = Sequential()
    model.add(Embedding(max_num_words, embedding_dim, input_length=max_sequence_length))
    model.add(LSTM(128, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(128))
    model.add(Dropout(0.2))
    model.add(Dense(128, activation='relu'))
    model.add(Dense(1, activation='sigmoid'))  # Adjust output layer for your specific task
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

# Fine-tune the model
def fine_tune_model(model, data, labels, epochs=10, batch_size=32):
    model.fit(data, labels, epochs=epochs, batch_size=batch_size, validation_split=0.2)

# Example usage
repo_path = '/path/to/git/repo'
texts = load_text_from_repo(repo_path)
data, word_index = preprocess_texts(texts)
labels = [0] * len(data)  # Dummy labels, replace with actual labels

max_num_words = 10000
embedding_dim = 100
max_sequence_length = 100

model = build_model(max_num_words, embedding_dim, max_sequence_length)
fine_tune_model(model, data, labels)