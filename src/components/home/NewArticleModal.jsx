import React, { Component } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { fetchTopics } from "../../utils/API-Requests";
import { postArticle } from "../../utils/API-Requests";
import { navigate } from "@reach/router";
import { handleChange } from "../../utils/handleChange";

export class NewArticleModal extends Component {
  state = {
    showing: false,
    topics: [],
    title: "",
    topic: "",
    body: "",
    author: ""
  };

  toggleNewArticleModal = () => {
    this.setState({
      showing: !this.state.showing
    });
  };

  componentDidMount() {
    fetchTopics().then(topics =>
      this.setState({
        topics: topics,
        topic: topics[0].slug
      })
    );
  }

  createNewArticle = event => {
    event.preventDefault();
    const { title, body, author, topic } = this.state;
    const newArticle = {
      title,
      body,
      author,
      topic
    };
    postArticle(newArticle).then(article => {
      navigate(`/articles/${article.article_id}`);
    });
    this.toggleNewArticleModal();
  };

  render() {
    return (
      <>
        <Button
          className="mr-2"
          variant="primary"
          onClick={this.toggleNewArticleModal}
        >
          New Article
        </Button>
        <Modal show={this.state.showing} onHide={this.toggleNewArticleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Complete all the fields</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  onChange={e => this.setState(handleChange(e))}
                  placeholder="e.g. Learning Python"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Topic</Form.Label>
                <Form.Control
                  as="select"
                  name="topic"
                  onChange={e => this.setState(handleChange(e))}
                >
                  {this.state.topics.map(topic => {
                    return <option key={topic.slug}>{topic.slug}</option>;
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  name="body"
                  onChange={e => this.setState(handleChange(e))}
                  placeholder="e.g. Unearthing the python concepts..."
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.toggleNewArticleModal}>
              Close
            </Button>
            <Button variant="primary" onClick={this.createNewArticle}>
              Post Article
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default NewArticleModal;
